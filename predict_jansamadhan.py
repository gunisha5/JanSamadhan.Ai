import argparse
import joblib


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", default="jansamadhan_model.joblib", help="Path to joblib model")
    parser.add_argument("--text", help="Single complaint text to classify")
    parser.add_argument("--interactive", action="store_true", help="Interactive mode (type inputs)")
    parser.add_argument("--threshold", type=float, default=0.35, help="Confidence threshold for fallback")
    parser.add_argument("--fallback", default="Other", help="Fallback label if confidence below threshold")
    args = parser.parse_args()

    model = joblib.load(args.model)

    def predict_one(t: str):
        if hasattr(model, "predict_proba"):
            proba = model.predict_proba([t])[0]
            classes = model.classes_
            top_i = int(proba.argmax())
            top_label = str(classes[top_i])
            top_p = float(proba[top_i])
            top_idx = proba.argsort()[-5:][::-1]
            top5 = [(classes[i], float(proba[i])) for i in top_idx]
            pred = top_label if top_p >= args.threshold else args.fallback
            return pred, top_p, top5
        pred = model.predict([t])[0]
        return pred, None, None

    if args.interactive:
        print("Interactive mode. Type a complaint and press Enter. Empty line to exit.")
        while True:
            t = input("> ").strip()
            if not t:
                break
            pred, top_p, top5 = predict_one(t)
            print("Pred:", pred)
            if top_p is not None:
                print(f"Top-1 confidence: {top_p:.3f} (threshold={args.threshold:.2f})")
            if top5:
                print("Top-5:", ", ".join([f"{c}={p:.3f}" for c, p in top5]))
        return

    if not args.text:
        raise SystemExit("Provide --text or use --interactive")

    pred, top_p, top5 = predict_one(args.text)
    print("Pred:", pred)
    if top_p is not None:
        print(f"Top-1 confidence: {top_p:.3f} (threshold={args.threshold:.2f})")
    if top5:
        print("Top-5:", ", ".join([f"{c}={p:.3f}" for c, p in top5]))


if __name__ == "__main__":
    main()

