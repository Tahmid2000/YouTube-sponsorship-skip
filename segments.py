from transcript import get_video_transcript, get_video_transcript_file
from analyze import analyze_transcript
import json

def getTimeSegmentsForVideo(video_id):
    [transcript, timestamps] = get_video_transcript(video_id)
    if len(transcript) == 0 or len(timestamps) == 0:
        return {'response': []}
    data = analyze_transcript(transcript)
    aiResponse = json.loads(data)
    # print(aiResponse)
    for i in range(len(aiResponse['response']) - 1, -1, -1):
        aiResponse['response'][i]['start'] = timestamps[aiResponse['response'][i]['start'] - 1]
        aiResponse['response'][i]['end'] = timestamps[aiResponse['response'][i]['end'] - 1]
    return aiResponse