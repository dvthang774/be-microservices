import { S3 } from 'aws-sdk';
import { Constants } from 'src/constant/constant';
export class AWSService {
  private getS3() {
    return new S3({
      region: Constants.aws_region,
      accessKeyId: Constants.aws_access_key,
      secretAccessKey: Constants.aws_secrect_key,
    });
  }
  private slug(str: string) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
    // remove accents, swap ñ for n, etc
    const from =
      'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;';
    const to =
      'AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------';
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
    str = str
      .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes
    return str;
  }
  private generateExtFile(filename: string) {
    return filename.split('.').pop();
  }
  private generateOrignialName(filename: string) {
    return filename.split('.').shift();
  }
  async uploadFile(file: Express.Multer.File) {
    const s3 = this.getS3();
    const getTime = new Date().getTime();
    const resolveFileName = `${getTime}_${this.slug(
      this.generateOrignialName(file.originalname),
    )}.${this.generateExtFile(file.originalname)}`;
    console.log(resolveFileName)
    const result = await s3
      .upload({
        Key: resolveFileName,
        Bucket: Constants.aws_public,
        ACL: 'public-read',
        Body: file.buffer,
        ContentType: file.mimetype,
      })
      .promise();
    return result;
  }
  async deleteFile(mediaKey: string) {
    const s3 = this.getS3();
    const params = {
      Bucket: Constants.aws_public,
      Key: mediaKey,
    };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    s3.deleteObject(params).promise();
    return true;
  }
}