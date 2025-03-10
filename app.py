from flask import Flask, render_template, request, redirect, url_for, session
import os, base64, uuid

app = Flask(__name__)
app.secret_key = "secret"
UPLOAD_FOLDER = "static/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/capture")
def capture():
    return render_template("capture.html")

@app.route("/process", methods=["POST"])
def process():
    data = request.json["photos"]
    filenames = []
    
    for photo in data:
        img_data = base64.b64decode(photo.split(",")[1])
        filename = f"{uuid.uuid4().hex}.png"
        with open(os.path.join(UPLOAD_FOLDER, filename), "wb") as f:
            f.write(img_data)
        filenames.append(filename)

    session["photos"] = filenames
    return {"redirect": url_for("photocard")}

@app.route("/photocard")
def photocard():
    photos = [url_for("static", filename=f"uploads/{f}") for f in session.get("photos", [])]
    return render_template("photocard.html", photos=photos)

if __name__ == "__main__":
    app.run(debug=True)
