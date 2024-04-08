import { Client , Databases , Account} from 'appwrite';

export const PROJECT_ID = "660d0404cc10057ce203"
export const DATABASE_ID = "660d07bfbfbab254966f"
export const COLLECTION_ID_MESSAGES = "660d07d821dc99c3e3f3"

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('660d0404cc10057ce203');
    
  export  const databases = new Databases(client);
  export const account = new Account(client)
  export default client