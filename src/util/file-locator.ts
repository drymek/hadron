import glob from "./glob-promise";

const locate = (paths: string[], configName: string, type: string,
                extensions: string[] = []): Promise<any> => {
    return new Promise((resolve, reject) => {
        paths.map((path) => path.toLowerCase());

        if (extensions.length > 0) {
            paths = addExtension(paths, extensions);
        }

        Promise.all(paths.map(glob)).then((data) => {
             filterPaths(flattenDeep(data.map((el) => el.sort())), configName, type).then(resolve);
        });
    });
};

const addExtension = (paths: string[], extensions: string[]): string[] => {
    const pathsWithExtension: string[] = [];

    extensions.map((ext) => {
        paths.map((path) => pathsWithExtension.push(`${path}.${ext.toLowerCase()}`));
    });

    return pathsWithExtension;
};

const flattenDeep = (arr: any[]): any[] => {
    return Array.isArray(arr) ? arr.reduce((a, b) => [...flattenDeep(a), ...flattenDeep(b)], []) : [arr];
};

const filterPaths = (data: string[], configName: string, type: string) => {
    return new Promise((resolve, reject) => {
        const arr: string[] = [];

        data.forEach((element) => {
            const fileName = (element.split("/")[element.split("/").length - 1]).split(".")[0];

            if (fileName === configName) {
                arr.push(element);
            } else if (fileName.includes("_")) {
                if (fileName.split("_")[0] === configName && fileName.split("_")[1] === type) {
                    arr.push(element);
                }
            }
        });

        resolve(arr);
    });
};

export default locate;