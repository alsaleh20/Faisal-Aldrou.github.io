import pypdf
import os

def extract_pdf(path):
    print(f"=== Extracting {path} ===")
    if not os.path.exists(path):
        print("File not found")
        return
    try:
        reader = pypdf.PdfReader(path)
        for i, page in enumerate(reader.pages):
            print(f"--- Page {i+1} ---")
            print(page.extract_text())
    except Exception as e:
        print(f"Error: {e}")

with open("fasel_cv_extracted.txt", "w", encoding="utf-8") as f:
    import sys
    sys.stdout = f
    extract_pdf("Faisal_Ahmad_Yousef_Aldrou_CV.pdf")
