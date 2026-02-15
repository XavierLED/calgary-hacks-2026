from fastapi import FastAPI
import requests

app = FastAPI()


@app.post("/fetch")
def fetch_url(url: str):
    response = requests.get(url)
    return response.json()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)