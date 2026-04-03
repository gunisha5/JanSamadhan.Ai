import pandas as pd
import argparse
import joblib
from typing import Dict, Tuple
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix, f1_score


def apply_threshold(model: Pipeline, X, threshold: float, fallback: str):
    if not hasattr(model, "predict_proba"):
        return model.predict(X)
    proba = model.predict_proba(X)
    classes = model.classes_
    top_idx = proba.argmax(axis=1)
    top_p = proba.max(axis=1)
    pred = classes[top_idx].astype(str)
    pred = pred.copy()
    pred[top_p < threshold] = fallback
    return pred


def evaluate_model(name: str, model: Pipeline, X_train, y_train, X_test, y_test, labels, threshold: float = 0.35, fallback: str = "Other"):
    model.fit(X_train, y_train)
    pred = model.predict(X_test)
    pred_thr = apply_threshold(model, X_test, threshold=threshold, fallback=fallback)

    acc = accuracy_score(y_test, pred)
    macro_f1 = f1_score(y_test, pred, average="macro")
    weighted_f1 = f1_score(y_test, pred, average="weighted")

    print(f"=== {name} ===")
    print(f"Accuracy:   {acc:.4f}")
    print(f"Macro F1:   {macro_f1:.4f}")
    print(f"Weighted F1:{weighted_f1:.4f}")
    print(f"Threshold:  {threshold:.2f} -> fallback '{fallback}'")
    print(f"Thr Acc:    {accuracy_score(y_test, pred_thr):.4f}")
    print(f"Thr MacroF1:{f1_score(y_test, pred_thr, average='macro'):.4f}")
    print()
    print(classification_report(y_test, pred, digits=3))

    cm = confusion_matrix(y_test, pred, labels=labels)
    cm_df = pd.DataFrame(cm, index=labels, columns=labels)
    print("Confusion matrix (rows=true, cols=pred):")
    print(cm_df)
    print()

    print("Thresholded report:")
    print(classification_report(y_test, pred_thr, digits=3))
    cm_thr = confusion_matrix(y_test, pred_thr, labels=labels)
    cm_thr_df = pd.DataFrame(cm_thr, index=labels, columns=labels)
    print("Thresholded confusion matrix (rows=true, cols=pred):")
    print(cm_thr_df)
    print()

    return {"acc": acc, "macro_f1": macro_f1, "weighted_f1": weighted_f1}, model


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", default="jansamadhan_train.csv", help="CSV with columns: text, category")
    parser.add_argument("--test", default=None, help="Optional held-out test CSV with columns: text, category")
    parser.add_argument("--model-out", default="jansamadhan_model.joblib", help="Output path for trained model")
    args = parser.parse_args()

    df = pd.read_csv(args.data)
    df["text"] = df["text"].astype(str).str.strip()
    df = df[df["text"] != ""]

    X = df["text"]
    y = df["category"]

    print("Class counts:")
    print(y.value_counts().sort_index())
    print()

    if args.test:
        train_X, train_y = X, y
        test_df = pd.read_csv(args.test)
        test_df["text"] = test_df["text"].astype(str).str.strip()
        test_df = test_df[test_df["text"] != ""]
        X_test, y_test = test_df["text"], test_df["category"]
        X_train, y_train = train_X, train_y
        print("Evaluating on external test set:")
        print(y_test.value_counts().sort_index())
        print()
    else:
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, stratify=y, random_state=42
        )

    labels = sorted(y.unique().tolist())

    # Baseline 1: word n-grams
    word_model = Pipeline(
        [
            (
                "tfidf",
                TfidfVectorizer(
                    analyzer="word",
                    ngram_range=(1, 2),
                    max_features=50000,
                    min_df=2,
                    sublinear_tf=True,
                ),
            ),
            (
                "clf",
                LogisticRegression(
                    max_iter=3000,
                    class_weight="balanced",
                ),
            ),
        ]
    )

    # Baseline 2: character n-grams (robust to typos/noise)
    char_model = Pipeline(
        [
            (
                "tfidf",
                TfidfVectorizer(
                    analyzer="char_wb",
                    ngram_range=(3, 5),
                    max_features=120000,
                    min_df=2,
                    sublinear_tf=True,
                ),
            ),
            (
                "clf",
                LogisticRegression(
                    max_iter=3000,
                    class_weight="balanced",
                ),
            ),
        ]
    )

    results: Dict[str, Tuple[dict, Pipeline]] = {}
    res_word, fitted_word = evaluate_model("Word TF-IDF (1-2 grams)", word_model, X_train, y_train, X_test, y_test, labels)
    results["word"] = (res_word, fitted_word)
    res_char, fitted_char = evaluate_model("Char TF-IDF (3-5 grams)", char_model, X_train, y_train, X_test, y_test, labels)
    results["char"] = (res_char, fitted_char)

    # Pick best by macro-F1 (more fair across classes)
    best_key = max(results.keys(), key=lambda k: results[k][0]["macro_f1"])
    best_res, best_model = results[best_key]

    print("=== Summary ===")
    print(f"Best model: {best_key} (macro_f1={best_res['macro_f1']:.4f}, acc={best_res['acc']:.4f})")

    joblib.dump(best_model, args.model_out)
    print(f"Saved best model to: {args.model_out}")


if __name__ == "__main__":
    main()

