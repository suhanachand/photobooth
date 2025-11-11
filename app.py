from flask import Flask, render_template, request, send_from_directory
import os
import base64

app = Flask(__name__)
UPLOAD_FOLDER = "photos"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/save_photo", methods=["POST"])
def save_photo():
    data_url = request.form["image"]
    # strip the prefix
    header, encoded = data_url.split(",", 1)
    data = base64.b64decode(encoded)
    filename = f"photo_{len(os.listdir(UPLOAD_FOLDER)) + 1}.png"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    with open(filepath, "wb") as f:
        f.write(data)
    return {"status": "success", "filename": filename}

@app.route("/photos/<filename>")
def get_photo(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == "__main__":
    app.run(debug=True)
