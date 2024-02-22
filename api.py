from fastapi import FastAPI, Body, Request
from database import cacheVideoAdSegments, getCachedVideoAdSegments
from segments import getTimeSegmentsForVideo
import ast
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://www.youtube.com"], #TODO: change
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/ad")
async def get_ad_timestamps(video_id: str = Body(..., embed=True)):
    cachedData = getCachedVideoAdSegments(video_id=video_id)
    if (cachedData is not None):
        return {"response": {"segments": ast.literal_eval(cachedData['segments']), "receivedFrom": "cache"}}
    response = getTimeSegmentsForVideo(video_id=video_id)
    cacheVideoAdSegments(video_id, response['response'])
    result = {"response": {"segments": response['response'], "receivedFrom": "gpt"}}
    return result