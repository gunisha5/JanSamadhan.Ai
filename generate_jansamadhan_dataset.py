import csv
import random
from dataclasses import dataclass


random.seed(42)


@dataclass(frozen=True)
class CategorySpec:
    name: str
    keywords: list[str]
    templates: list[str]


LOCATIONS = [
    "Sector 12", "Sector 21", "Ward 5", "Ward 11", "MG Road", "Ring Road", "Nehru Nagar",
    "Shivaji Chowk", "Civil Lines", "Model Town", "Gandhi Nagar", "Old City", "New Town",
    "Block A", "Block C", "Phase 1", "Phase 2", "Main Bazaar", "Station Road",
]

TIME_FRAGMENTS = [
    "since yesterday", "for 2 days", "for 3 days", "for a week", "since last week",
    "since last month", "from 10 AM today", "from last night", "for 48 hours",
]

SEVERITY = [
    "urgent", "high priority", "needs immediate attention", "please resolve asap",
    "requesting quick action", "kindly look into this",
]

HINDI_HINTS = [
    "kripya", "jaldi", "bahut problem", "madad kijiye", "please", "sir/madam", "namaskar",
]


def vary(text: str) -> str:
    # Add small natural variations: punctuation, extra details, Hinglish tokens.
    extras = []
    if random.random() < 0.6:
        extras.append(random.choice(TIME_FRAGMENTS))
    if random.random() < 0.45:
        extras.append(f"near {random.choice(LOCATIONS)}")
    if random.random() < 0.35:
        extras.append(random.choice(SEVERITY))
    if random.random() < 0.25:
        extras.append(random.choice(HINDI_HINTS))
    suffix = ""
    if extras:
        suffix = " " + " ".join(extras)
    # Random ending
    end = random.choice([".", "!", " pls.", " Kindly help.", " Thanks.", ""])
    return (text + suffix + end).strip()

def add_noise(text: str) -> str:
    # Light, realistic noise: abbreviations, removed vowels, missing spaces, typos.
    if random.random() < 0.25:
        text = text.replace("please", "pls").replace("kindly", "plz")
    if random.random() < 0.18:
        text = text.replace(" not ", " n't ").replace(" is ", " 's ")
    if random.random() < 0.15:
        text = text.replace("government", "govt").replace("application", "app")
    if random.random() < 0.12:
        # crude typo: swap two adjacent chars
        i = random.randint(0, max(0, len(text) - 2))
        text = text[:i] + text[i + 1] + text[i] + text[i + 2 :]
    return text

SPECS: list[CategorySpec] = [
    CategorySpec(
        "Electricity",
        ["power cut", "transformer", "meter", "voltage", "street light"],
        [
            "No electricity in my area",
            "Frequent power cuts every night",
            "Transformer is sparking and making noise",
            "Voltage fluctuation is damaging appliances",
            "Electricity bill shows wrong meter reading",
            "Street light not working on the road",
        ],
    ),
    CategorySpec(
        "Water",
        ["water supply", "leakage", "pipeline", "tap", "dirty water"],
        [
            "No water supply to our house",
            "Water pipeline leakage on the street",
            "Dirty water coming from taps",
            "Low water pressure in the morning",
            "Water overflow from overhead tank in locality",
        ],
    ),
    CategorySpec(
        "Sanitation",
        ["garbage", "waste", "drain", "sewage", "cleaning"],
        [
            "Garbage not collected from our lane",
            "Overflowing dustbin and waste smell",
            "Drain is blocked and sewage is overflowing",
            "No street cleaning in our area",
            "Public toilet is not maintained",
        ],
    ),
    CategorySpec(
        "Roads",
        ["potholes", "road damage", "street", "bridge", "footpath"],
        [
            "Road has big potholes causing accidents",
            "Broken footpath making it unsafe to walk",
            "Road construction left incomplete",
            "Damaged bridge railing is dangerous",
            "Street road is flooded because of bad surface",
        ],
    ),
    CategorySpec(
        "Telecom",
        ["mobile network", "call drop", "tower", "signal", "sim"],
        [
            "Mobile network not working properly",
            "Frequent call drops and poor signal",
            "SIM not active even after recharge",
            "No network coverage inside my house",
            "Telecom service provider complaint about tower",
        ],
    ),
    CategorySpec(
        "Banking",
        ["atm", "upi", "transaction", "debit", "account"],
        [
            "UPI transaction failed but amount deducted",
            "ATM cash not received but balance debited",
            "Bank account blocked without reason",
            "Cheque clearance taking too long",
            "Net banking login not working",
        ],
    ),
    CategorySpec(
        "Insurance",
        ["claim", "policy", "premium", "insurance"],
        [
            "Insurance claim not processed yet",
            "Policy document not received",
            "Premium paid but policy not updated",
            "Claim rejected without clear reason",
            "Need correction in insurance policy details",
        ],
    ),
    CategorySpec(
        "Pension",
        ["pension", "payment", "benefit", "disbursement"],
        [
            "Pension not credited to my account",
            "Delay in pension payment every month",
            "Wrong pension amount received",
            "Pension status showing pending for long time",
        ],
    ),
    CategorySpec(
        "Education",
        ["school", "college", "scholarship", "teacher", "admission"],
        [
            "School has no proper drinking water and toilets",
            "Scholarship amount not received",
            "Teacher not coming regularly to school",
            "College fee receipt not generated online",
            "Admission portal shows error for my application",
        ],
    ),
    CategorySpec(
        "Healthcare",
        ["hospital", "doctor", "medicine", "ambulance", "clinic"],
        [
            "Hospital staff not available at counter",
            "Doctor not present in government hospital",
            "Medicine not available in dispensary",
            "Ambulance not arriving on time",
            "Long waiting time in OPD and poor management",
        ],
    ),
    CategorySpec(
        "Transport",
        ["bus", "metro", "route", "ticket", "delay"],
        [
            "Bus not stopping at our stop",
            "Public bus service delayed daily",
            "Overcrowding in buses and no frequency",
            "Ticketing machine not working in bus",
            "Driver rash driving complaint",
        ],
    ),
    CategorySpec(
        "Documents",
        ["aadhaar", "pan", "passport", "certificate", "license"],
        [
            "Aadhaar update request pending",
            "Birth certificate not issued yet",
            "Passport verification delayed",
            "Driving license application stuck",
            "Name correction in PAN card not done",
        ],
    ),
    CategorySpec(
        "Housing",
        ["housing scheme", "allotment", "flat", "maintenance", "repair"],
        [
            "Housing scheme application rejected wrongly",
            "Flat allotment not received after approval",
            "Government housing maintenance issue",
            "Leakage in allotted house and no repair",
        ],
    ),
    CategorySpec(
        "Employment",
        ["job", "recruitment", "salary", "scheme", "unemployment"],
        [
            "Job application status not updated",
            "Recruitment exam result not published",
            "Salary not received under scheme",
            "Employment office registration issue",
        ],
    ),
    CategorySpec(
        "Law & Order",
        ["police", "complaint", "theft", "safety", "harassment"],
        [
            "Police not responding to complaint",
            "Theft incident reported but no action",
            "Safety issue in locality at night",
            "Harassment complaint needs attention",
        ],
    ),
    CategorySpec(
        "Railways",
        ["train", "railway", "ticket", "station", "delay"],
        [
            "Train delayed without information",
            "Cleanliness issue at railway station",
            "Refund not received for cancelled ticket",
            "Overcharging by vendors at station",
        ],
    ),
    CategorySpec(
        "Gas",
        ["lpg", "cylinder", "gas leakage", "booking", "delivery"],
        [
            "Gas cylinder not delivered after booking",
            "LPG subsidy not received",
            "Gas leakage complaint - dangerous",
            "Wrong cylinder delivered by agency",
        ],
    ),
    CategorySpec(
        "Internet Services",
        ["broadband", "wifi", "internet down", "router", "speed"],
        [
            "Broadband internet not working",
            "WiFi speed is very slow",
            "Internet connection down frequently",
            "Router replacement not provided",
            "Internet bill paid but service suspended",
        ],
    ),
    CategorySpec(
        "Tax",
        ["gst", "income tax", "refund", "pan linked", "tax portal"],
        [
            "Income tax refund not received",
            "GST registration issue on portal",
            "Tax portal login problem",
            "Wrong tax demand notice received",
            "PAN not linked with Aadhaar error",
        ],
    ),
    CategorySpec(
        "Other",
        ["misc", "general", "complaint", "help"],
        [
            "General complaint about public service delay",
            "Need help regarding government portal issue",
            "Complaint about staff behavior at office",
            "Information not updated on website",
            "Requesting guidance for grievance process",
        ],
    ),
]


CONFUSERS = [
    "portal error", "service not working", "bill issue", "refund not received",
    "complaint not updated", "status pending", "support not responding",
]


def _gen_from_templates(spec: CategorySpec, templates: list[str], per_class: int, keyword_inject_p: float, noisy: bool) -> list[tuple[str, str]]:
    rows: list[tuple[str, str]] = []
    for _ in range(per_class):
        base = random.choice(templates)
        if random.random() < keyword_inject_p:
            # Avoid explicit parentheses pattern (too easy); sprinkle keyword more naturally
            base = f"{base} - {random.choice(spec.keywords)}"
        # Add a confuser phrase sometimes to create overlap between categories
        if random.random() < 0.30:
            base = f"{base}; {random.choice(CONFUSERS)}"
        text = vary(base)
        if noisy:
            text = add_noise(text)
        rows.append((text, spec.name))
    random.shuffle(rows)
    return rows


def main():
    train_path = "jansamadhan_train.csv"
    test_path = "jansamadhan_test_hard.csv"

    train_rows: list[tuple[str, str]] = []
    test_rows: list[tuple[str, str]] = []

    for spec in SPECS:
        # Hold out some templates entirely for the hard test set.
        templates = list(spec.templates)
        random.shuffle(templates)
        cut = max(1, int(len(templates) * 0.7))
        train_templates = templates[:cut]
        test_templates = templates[cut:] or templates[-1:]

        train_rows.extend(_gen_from_templates(spec, train_templates, per_class=100, keyword_inject_p=0.15, noisy=False))
        # Hard test: unseen templates + noise, and *no* keyword injection crutch.
        test_rows.extend(_gen_from_templates(spec, test_templates, per_class=30, keyword_inject_p=0.05, noisy=True))

    random.shuffle(train_rows)
    random.shuffle(test_rows)

    for out_path, rows in [(train_path, train_rows), (test_path, test_rows)]:
        with open(out_path, "w", newline="", encoding="utf-8") as f:
            w = csv.writer(f)
            w.writerow(["text", "category"])
            w.writerows(rows)

    print(f"Wrote {len(train_rows)} rows to {train_path}")
    print(f"Wrote {len(test_rows)} rows to {test_path}")


if __name__ == "__main__":
    main()

