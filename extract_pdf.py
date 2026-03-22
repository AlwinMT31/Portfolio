import sys
import fitz  # PyMuPDF

def extract_text(pdf_path):
    print(f"Extracting standard text from {pdf_path}:")
    try:
        doc = fitz.open(pdf_path)
        text = "--- Standard Text ---\n"
        for page in doc:
            text += page.get_text() + "\n"
        
        text += "\n--- Blocks Text ---\n"
        for page in doc:
            blocks = page.get_text("blocks")
            for b in blocks:
                text += b[4] + "\n"
                
        with open("cv_text.txt", "w", encoding="utf-8") as f:
            f.write(text)
            
        print("Successfully wrote to cv_text.txt")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    extract_text(sys.argv[1])
