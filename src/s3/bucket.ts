import EasyYandexS3 from "easy-yandex-s3";

export let s3 = new EasyYandexS3({
  auth: {
    accessKeyId: process.env.YC_KEY_ID,
    secretAccessKey: process.env.YC_SECRET,
  },
  Bucket: process.env.YC_BUCKET_NAME,
  debug: false
})
