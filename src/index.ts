import express from 'express';


const main = async () => {
    const app = express();
    const port = process.env.PORT || 9500


    app.listen(port, () => {
        console.log(`listening on port: ${port}`)
    });
}
main().catch((err) => {
  console.error(err);
});