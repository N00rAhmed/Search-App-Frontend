import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    const res = await axios.get("http://localhost:8000/documents/");
    setDocs(res.data);
  };

  const handleUpload = async () => {
    const txtFileData = new FormData();
    if (file) {
      txtFileData.append("file", file);
    } else {
      txtFileData.append("text", text);
    }

    await axios.post("http://localhost:8000/upload/", txtFileData);
    fetchDocs();
  };

  const handleSearch = async () => {
    const res = await axios.get("http://localhost:8000/search/", {
      params: { doc_id: selectedDoc, query },
    });
    setResults(res.data);
  };

  return (
    <div className="p-6 space-y-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Search App</h1>

      <div className="space-y-2">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />

        <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded">
          Upload
        </button>
      </div>
      <br/>
      <div className="space-y-2">
        <select onChange={(e) => setSelectedDoc(e.target.value)} className="w-full border p-2">

          <option value="">Select a document</option>

          {docs.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name}
            </option>
          ))}
        </select>
        
        <input
          type="text"
          placeholder="Search query"
          className="w-full border p-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button onClick={handleSearch} className="bg-green-500 text-white px-4 py-2 rounded">
          Search
        </button>
      </div>

      <div>

        <h2 className="text-xl font-semibold">Results</h2>

        {results.map((data, i) => (
          <p key={i} className="border-b py-1">
            {data.content}
          </p>
        ))}

      </div>
    </div>
  );
}

export default App;
