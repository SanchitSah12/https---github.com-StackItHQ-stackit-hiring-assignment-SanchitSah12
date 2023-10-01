
import { parse } from "csv-parse";

export async function getColumns(files) {
    const columnNames = [];

    files.pipe(
        parse({ delimiter: ",", from_line: 1, to_line: 1, trim: true, skip_empty_lines: true, columns: true })
    ).on("data", (data) => {
        columnNames.push(...Object.keys(data));
    }).on("end", () => {
        console.log(columnNames);
    });
}