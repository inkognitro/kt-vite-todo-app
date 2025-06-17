const { generateOas3ToTs } = require("oas-tszod-gen");
const oas3Specification = require("./api.oas3.json");

generateOas3ToTs({
    getSpecification: () => {
        return new Promise((resolve) => {
            resolve(oas3Specification);
        });
    },
    outputFolderPath: "./src/lib/api",
    logger: {
        log: (data) => {
            console.log(data);
        },
    },
    withZod: true,
});
