from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=openai_api_key)

def analyze_transcript(transcript):
    response = client.chat.completions.create(
    model="gpt-4-turbo-preview",
    messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": f"You need to analyze this transcript of a youtube video to find segments that might be sponsorships or ads, and not related to the main content of the video : {transcript}. The transcript has numbers attached to the beginning of each series of tokens. Please provide the first and last numbers for each sponsorship segment. You must respond in JSON only with no other fluff or bad things will happen. The JSON key must be 'response' and the value must be an array of objects where each object has keys of 'start' and 'end' to signify the beginning and end of the segments. Do not return the JSON inside a code block or add any new line characters, spaces, or other extra characters."
                    }
                ],
            }
        ],
        max_tokens=200,
    )
    return response.choices[0].message.content

# print(analyze_transcript("zDE6Ea72_t8?si=h34L4Tp5_7f0L0Bo"))