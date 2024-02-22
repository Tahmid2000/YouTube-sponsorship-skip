from azure.data.tables import TableServiceClient
import uuid
import os
from dotenv import load_dotenv

load_dotenv()
connection_string = os.getenv("AZURE_TABLE_CONNECTION_STRING")

table_service = TableServiceClient.from_connection_string(conn_str=connection_string)
table_client = table_service.get_table_client(table_name="videoAdSegments")

def cacheVideoAdSegments(video_id: str, segments: str):
    existingData = getCachedVideoAdSegments(video_id)
    if existingData is not None:
        return existingData
    table_client.create_entity(entity={"PartitionKey": str(uuid.uuid4()), "RowKey": str(uuid.uuid4()), "videoId":f"{video_id}", "segments": f"{segments}"})

def getCachedVideoAdSegments(video_id: str):
    entities = list(table_client.query_entities(f"videoId eq '{video_id}'"))
    return None if len(entities) == 0 else entities[0]

def deleteCachedVideoAdSegment(video_id: str):
    existingData = getCachedVideoAdSegments(video_id)
    if existingData is None:
        return
    table_client.delete_entity(existingData)

#add parition key and connection string to env
# cacheVideoAdSegments("zDE6Ea72_t8?si=h34L4Tp5_7f0L0Bo", "[{'start':26,'end':37},{'start':26,'end':37}]")
# deleteCachedVideoAdSegment("Eqiw_ZEIhIg")
# print(getVideoAdSegments("zDE6Ea72_t8?si=h34L4Tp5_7f0L0Bo"))