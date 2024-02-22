from youtube_transcript_api import YouTubeTranscriptApi

def get_video_transcript_file(video_id):
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    concatenated_text = "\n".join([f"{i + 1}. {d['text']}" for i, d in enumerate(transcript)])
    concatenated_timestamps = "\n".join([f"{i + 1}. {d['start']}" for i, d in enumerate(transcript)])
    transcript_file_name = f"{video_id}-transcript.txt"
    timestamps_file_name = f"{video_id}-timestamps.txt"
    with open(transcript_file_name, "w") as file:
        file.write(concatenated_text)
    file.close()
    with open(timestamps_file_name, "w") as file:
        file.write(concatenated_timestamps)
    file.close()
    return [concatenated_text, concatenated_timestamps]

# get_video_transcript_file("zDE6Ea72_t8?si=h34L4Tp5_7f0L0Bo")

def get_video_transcript(video_id):
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        concatenated_text = "\n".join([f"{i + 1}. {d['text']}" for i, d in enumerate(transcript)])
        concatenated_timestamps = [d["start"] for d in transcript]
        return [concatenated_text, concatenated_timestamps]
    except:
        return ["", []]