import { useState } from "react";
import FileUpload from "./UploadSection/FileUpload";
import axios from 'axios';
const MainSection = () => {
    const [uploadedFile, setUploadedFile] = useState();
    const [responseMessage, setResponseMessage] = useState(null);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const handleFileUpload = async (files) => {
        // Create a new FormData object
        const formData = new FormData();

        // Append the file to the FormData object
        formData.append("file", files[0]);

        // Make a POST request to your backend endpoint
        const response = await fetch("http://localhost:3000/upload", {
            method: "POST",
            body: formData,
        });

        // Handle the response from the backend
        const data = await response.json();
        console.log(data);

        // Update the uploaded files state
        setUploadedFile(files[0]);

        // Update the response message state
        setResponseMessage(data);
        setShowPopup((prev) => !prev);
    };



    const handleColumnSelection = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        setShowPopup((prev) => !prev);
        // Append the file to the FormData object
        formData.append("data", uploadedFile);
        formData.append("columns", selectedColumns);


        try {
            const response = await axios.post('http://localhost:3000/spreadsheet', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response);
            // Handle the server's response
        } catch (error) {
            // Handle errors
            console.error(error);
        }
        // Make a POST request to your backend endpoint
    };

    return (
        <>
            {showPopup && (
                <div className="card card-compact w-96 bg-base-100 shadow-xl absolute left-0 right-0 ml-auto mr-auto top-56">
                    <div className="card-body">
                        <h1>Choose what columns you want to include</h1>
                        <form onSubmit={handleColumnSelection}>
                            <ul>
                                {responseMessage.map((columnName, index) => (
                                    <li className="font-mono text-lg" key={index}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                value={columnName}
                                                checked={selectedColumns.includes(columnName)}
                                                onChange={(event) => {
                                                    if (event.target.checked) {
                                                        setSelectedColumns([...selectedColumns, columnName]);
                                                    } else {
                                                        setSelectedColumns(selectedColumns.filter((name) => name !== columnName));
                                                    }
                                                }}
                                            />
                                            <span className="px-3">{columnName}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                            <button className="btn btn-accent mt-3" type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex flex-col">

                <h1 className="text-center font-bold text-2xl mb-10">Drag and Drop File Upload</h1>
                <FileUpload onFileUpload={handleFileUpload} />
            </div>
        </>
    );
};

export default MainSection;