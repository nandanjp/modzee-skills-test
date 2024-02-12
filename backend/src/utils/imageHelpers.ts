import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const getS3Client = () =>
{
    return new S3Client({
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY
        },
        region: process.env.BUCKET_REGION
    });
};

export const saveImage = async (file: Buffer, fileType: string, fileName: string): Promise<string | undefined> =>
{
    try
    {
        const s3 = getS3Client();
        const response = await s3.send(new PutObjectCommand({
            Bucket: process.env.BUCKET_REGION,
            Key: fileName,
            Body: file,
            ContentType: fileType,
        }));
        console.log(response);
        if (!response)
        {
            return undefined;
        }
        return `File successfully created, with the name: ${fileName}`;
    } catch (error)
    {
        throw new Error(`Failed to save file to s3: ${error}`);
    }

};

export const getImage = async (fileName: string) =>
{
    try
    {
        const s3 = getS3Client();
        const response = await s3.send(new GetObjectCommand({
            Bucket: process.env.BUCKET_REGION,
            Key: fileName,
        }));
        if (!response)
        {
            return undefined;
        }
        const fileToBytes = await response.Body?.transformToByteArray();
        return new File(
            [fileToBytes as ArrayBufferView],
            fileName,
            { type: response.ContentType }
        );
    } catch (error)
    {
        throw new Error(`Failed to retrieve the file, ${fileName} from s3: ${error}`);
    }
};

export const deleteImage = async (fileName: string) =>
{
    try
    {
        const s3 = getS3Client();
        const response = await s3.send(new DeleteObjectCommand({
            Bucket: process.env.BUCKET_REGION,
            Key: fileName,
        }));
        if (!response)
        {
            throw new Error(`Failed to delete the file with the name: ${fileName}`);
        }
        return `Successfully deleted the file with the name: ${fileName}`;
    } catch (error)
    {
        throw new Error(`Failed to delete the file with the name: ${fileName}`);
    }
};