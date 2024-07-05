import React, { useCallback, useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BreakTimeSettings from "./BreakTimeSettings";
import CodeMirrorEditor from "./CodeMirrorEditor";
import "./Editor.css";
import { TreeNodeType, Treeview } from "./FileTree";
import PasswordModal from "./PasswordModal";
import PopupParam from "./PopupParam";
import Notification from "./Notification"; // Import the Notification component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faCog, faPowerOff } from '@fortawesome/free-solid-svg-icons';

const emojiArray = ["🍆", "💦", "🍑", "😀", "😂", "😊", "😍", "🤩", "😎", "🤔", "🤗", "🥳", "😜", "🧐", "😇", "🥺", "🤯", "🤠", "🤓", "🤑", "🤡", "🥶", "💀", "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐽", "🐸", "🐵", "🙈", "🙉", "🙊", "🐒", "🐔", "🐧", "🐦", "🐤", "🐣", "🐥", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌", "🐞", "🐜", "🦟", "🦗", "🕷", "🕸", "🦂", "🐢", "🐍", "🦎", "🦖", "🦕", "🐙", "🦑", "🦐", "🦞", "🦀", "🐡", "🐠", "🐟", "🐬", "🐳", "🐋", "🦈", "🐊", "🐅", "🐆", "🦓", "🦍", "🦧", "🐘", "🦛", "🦏", "🐪", "🐫", "🦒", "🦘", "🐃", "🐂", "🐄", "🐎", "🐖", "🐏", "🐑", "🦙", "🐐", "🦌", "🐕", "🐩", "🦮", "🐕‍🦺", "🐈", "🐓", "🦃", "🦚", "🦜", "🦢", "🦩", "🕊", "🐇", "🦝", "🦨", "🦡", "🦦", "🦥", "🐁", "🐀", "🐿", "🦔", "🐾", "🐉", "🐲", "🌵", "🎄", "🌲", "🌳", "🌴", "🌱", "🌿", "☘️", "🍀", "🎍", "🎋", "🍃", "🍂", "🍁", "🍄", "🍄", "🐚", "🌾", "💐", "🌷", "🌹", "🥀", "🌺", "🌸", "🌼", "🌻", "🌞", "🌝", "🌛", "🌜", "🌚", "🌕", "🌖", "🌗", "🌘", "🌑", "🌒", "🌓", "🌔", "🌙", "🌎", "🌍", "🌏", "🪐", "💫", "⭐️", "🌟", "✨", "⚡️", "☄️", "💥", "🔥", "🌪", "🌈", "☀️", "🌤", "⛅️", "🌥", "☁️", "🌦", "🌧", "⛈", "🌩", "🌨", "❄️", "☃️", "⛄️", "🌬", "💨", "💧", "☔️", "☂️", "🌊", "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💎", "💰", "🎁", "🎈", "📈", "📉", "📐", "📏", "🧮", "📌", "📍", "✂️", "✒️", "📝", "✏️", "🔍", "🔎", "🔏", "🔐", "🔒", "🔓", "🔭", "🔬", "🎊", "🎉", "🌠", "🎇", "🎆", "🌇", "🌆", "🏙", "🌃", "🌌", "🌉", "🌁", "🗿", "⚽️", "🏀", "🏈", "⚾️", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🥭", "🍍", "🥥", "🥝", "🍅", "🥑", "🥦", "🥬", "🥒", "🌶", "🌽", "🥕", "🧄", "🧅", "🥔", "🍠", "🥐", "🥯", "🍞", "🥖", "🥨", "🧀", "🥚", "🍳", "🧈", "🥞", "🧇", "🥓", "🥩", "🍗", "🍖", "🦴", "🌭", "🍔", "🍟", "🍕", "🥪", "🥙", "🧆", "🌮", "🌯", "🥗", "🥘", "🥫", "🍝", "🍜", "🍲", "🍛", "🍣", "🍱", "🥟", "🦪", "🍤", "🍙", "🍚", "🍘", "🍥", "🥠", "🥮", "🍢", "🍡", "🍧", "🍨", "🍦", "🥧", "🧁", "🍰", "🎂", "🍮", "🍭", "🍬", "🍫", "🍿", "🍩", "🍪", "🌰", "🥜", "🍯", "🥛", "🍼", "☕️", "🍵", "🧃", "🥤", "🍶", "🍺", "🍻", "🥂", "🍷", "🥃", "🍸", "🍹", "🧉", "🍾", "🧊", "🥄", "🍴", "🍽", "🥣", "🥡", "🥢", "🧂"];

const Editor: React.FC = () => {
  const [content, setContent] = useState<string>("");
  const [originalContent, setOriginalContent] = useState<string>("");
  const [filePath, setFilePath] = useState<string>("");
  const [language, setLanguage] = useState<"python" | "java">("python");
  const [output, setOutput] = useState<string>("");
  const [treeData, setTreeData] = useState<TreeNodeType[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [fontFamily, setFontFamily] = useState<string>("monospace");
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [isParamOpen, setIsParamOpen] = useState<boolean>(false);
  const [isCiphered, setIsCiphered] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [breakTime, setBreakTime] = useState<{ startTime: string, endTime: string } | null>(null);
  const [showNotification5, setShowNotification5] = useState<boolean>(false);
  const [showNotification2, setShowNotification2] = useState<boolean>(false);
  const [showNotification1, setShowNotification1] = useState<boolean>(false);
  const navigate = useNavigate();

  const usernameRef = useRef<string | null>(null);
  const breakTimeRef = useRef<{ startTime: string, endTime: string } | null>(null);

  const openParamPopup = () => {
    setIsParamOpen(true);
  };
  const closeParamPopup = () => {
    setIsParamOpen(false);
  };

  const fetchBreakTime = useCallback(async () => {
    try {
      const response = await axios.get("/api/getBreakTime");
      setBreakTime(response.data);
      breakTimeRef.current = response.data;
    } catch (error) {
      console.error("Error fetching break time:", error);
    }
  }, []);

  const fetchUsername = useCallback(async () => {
    try {
      const response = await axios.get("/api/currentUsername");
      setUsername(response.data.username);
      usernameRef.current = response.data.username;
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  }, []);

  const checkBreakTimeAndRedirect = useCallback(() => {
    const currentBreakTime = breakTimeRef.current;
    if (currentBreakTime) {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      if (currentTime >= currentBreakTime.startTime && currentTime <= currentBreakTime.endTime) {
        navigate("/break");
      }
    }
  }, [navigate]);

  const calculateNextBreakNotification = useCallback(() => {
    const currentBreakTime = breakTimeRef.current;
    if (currentBreakTime) {
      const now = new Date();
      const [startHours, startMinutes] = currentBreakTime.startTime.split(':').map(Number);
      const nextBreakTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHours, startMinutes);
      const timeUntilNextBreak = nextBreakTime.getTime() - now.getTime();
      const notificationTime5 = timeUntilNextBreak - 5 * 60 * 1000; // 5 minutes before the break
      const notificationTime2 = timeUntilNextBreak - 2 * 60 * 1000; // 2 minutes before the break
      const notificationTime1 = timeUntilNextBreak - 1 * 60 * 1000; // 1 minute before the break
      if (notificationTime5 > 0) {
        setTimeout(() => {
          setShowNotification5(true);
        }, notificationTime5);
      }
      else if (notificationTime2 > 0) {
        setTimeout(() => {
          setShowNotification2(true);
        }, notificationTime2);
      }
      else if (notificationTime1 > 0) {
        setTimeout(() => {
          setShowNotification1(true);
        }, notificationTime1);
      }
    }
  }, []);

  useEffect(() => {
    const checkAccessAndInitialize = async () => {
      try {
        if (!usernameRef.current) {
          await fetchUsername();
        }
        if (!breakTimeRef.current) {
          await fetchBreakTime();
        }
        checkBreakTimeAndRedirect();
        calculateNextBreakNotification();

        const savedContent = localStorage.getItem("content");
        const savedFilePath = localStorage.getItem("filePath");
        const savedSelected = localStorage.getItem("selected");
        const savedFontFamily = localStorage.getItem("fontFamily");
        if (savedContent) setContent(savedContent);
        if (savedFilePath) setFilePath(savedFilePath);
        if (savedSelected) setSelected(savedSelected);
        if (savedFontFamily) setFontFamily(savedFontFamily);
      } catch (error) {
        console.error("Error initializing editor:", error);
      }
    };

    checkAccessAndInitialize();
  }, [checkBreakTimeAndRedirect, calculateNextBreakNotification, fetchBreakTime, fetchUsername]);

  useEffect(() => {
    localStorage.setItem("content", content);
    localStorage.setItem("filePath", filePath);
    localStorage.setItem("selected", selected || "");
    localStorage.setItem("fontFamily", fontFamily);
  }, [content, filePath, selected, fontFamily]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchBreakTime();
      checkBreakTimeAndRedirect();
      calculateNextBreakNotification();
    }, 30000); // Check every minute

    return () => clearInterval(intervalId);
  }, [fetchBreakTime, checkBreakTimeAndRedirect, calculateNextBreakNotification]);

  const fileExtensionToLanguage = useCallback(
    (path: string): "python" | "java" => {
      const extension = path.split(".").pop()?.toLowerCase();
      return extension === "py"
        ? "python"
        : extension === "java"
        ? "java"
        : "python";
    },
    []
  );

  const fetchFiles = useCallback(async (directoryPath: string) => {
    try {
      const response = await axios.post("/api/explore", { directoryPath });
      return response.data.map(
        (file: { name: string; directory: boolean }) => ({
          id: directoryPath ? `${directoryPath}/${file.name}` : file.name,
          name: file.name,
          children: file.directory ? [] : undefined,
          directory: file.directory,
        })
      );
    } catch (error) {
      console.error("Error fetching files:", error);
      alert("Error fetching files: " + error);
      return [];
    }
  }, []);

  const fetchChildren = useCallback(
    async (id: string): Promise<TreeNodeType[]> => {
      return fetchFiles(id);
    },
    [fetchFiles]
  );

  useEffect(() => {
    const initializeTree = async () => {
      const rootChildren = await fetchFiles("");
      setTreeData(rootChildren);
    };

    initializeTree();
  }, [fetchFiles]);

  const openFile = useCallback(
    async (path: string) => {
      try {
        const response = await axios.post("/api/open", { filePath: path });
        if (response.data.startsWith("Error: Path is a directory")) {
          const fetchedChildren = await fetchFiles(path);
          setTreeData((prevData) =>
            prevData.map((node) =>
              node.id === path ? { ...node, children: fetchedChildren } : node
            )
          );
        } else if (response.data.startsWith("Error")) {
          alert(response.data);
        } else {
          const fileContent = response.data;
          setContent(fileContent);
          setOriginalContent(fileContent);
          const detectedLanguage = fileExtensionToLanguage(path);
          setLanguage(detectedLanguage);
          setFilePath(path);
          setSelected(path);
        }
      } catch (error) {
        console.error("Error opening file:", error);
        alert("Error opening file: " + error);
      }
    },
    [fileExtensionToLanguage, fetchFiles]
  );

  const saveFile = useCallback(async (fileName: string) => {
    try {
      if (fileName === null || fileName === '') {
        alert("Error empty fileName");
        return;
      }
      const response = await axios.post("/api/save", {
        filePath: filePath,
        content: content,
      });
      if (response.data.startsWith("Error")) {
        alert(response.data);
      } else {
        alert("File saved successfully!");
      }
    } catch (error) {
      console.error("Error saving file:", error);
      alert("Error saving file: " + error);
    }
  }, [filePath, content]);

  const deleteFile = useCallback(async () => {
    if (!selected) {
      alert("No file selected!");
      return;
    }

    try {
      const response = await axios.post("/api/delete", { filePath: selected });
      alert("File deleted successfully!");
      setTreeData((prev) => prev.filter((node) => node.id !== selected));
      setSelected(null);
      setContent("");
      setOriginalContent("");
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Error deleting file: " + error);
    }
  }, [selected]);

  const executeFile = useCallback(async (fileName: string) => {
    try {
      if (fileName === null || fileName === '') {
        alert("Error empty fileName");
        return;
      }
      const response = await axios.post("/api/execute", {
        filePath: filePath,
        content: content,
        language: language,
      });
      if (response.data.startsWith("Error")) {
        alert(response.data);
      } else {
        setOutput(response.data);
      }
    } catch (error) {
      console.error("Error executing file:", error);
      alert("Error executing file: " + error);
    }
  }, [filePath, content, language]);

  const handleChange = useCallback((value: string) => {
    setContent(value);
  }, []);

  const createNewFile = useCallback(
    async (fileName: string) => {
      try {
        if (fileName === null || fileName === '') {
          alert("Error empty fileName");
          return;
        }
        const response = await axios.post("/api/create", {
          filePath: fileName,
          isDirectory: false,
        });
        if (response.data.startsWith("Error")) {
          alert(response.data);
        } else {
          alert("File created successfully!");
          setTreeData(await fetchFiles(""));
        }
      } catch (error) {
        console.error("Error creating file:", error);
        alert("Error creating file: " + error);
      }
    },
    [fetchFiles]
  );

  const toggleCipher = () => {
    if (isCiphered) {
      setShowPasswordModal(true);
    } else {
      cipherContent();
      setIsCiphered(true);
    }
  };

  const cipherContent = () => {
    const ciphered = content
      .split("\n")
      .map(() => {
        const rand = Math.floor(Math.random() * emojiArray.length);
        return Array.from({ length: 20 }, () => emojiArray[rand]).join("");
      })
      .join("\n");
    setContent(ciphered);
  };

  const decipherContent = () => {
    setContent(originalContent);
  };

  const validatePassword = async (password: string) => {
    try {
      const response = await axios.post("/api/validatePassword", {
        username,
        password,
      });
      return response.data.valid;
    } catch (error) {
      console.error("Error validating password:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/logout");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Error logging out: " + error);
    }
  };

  const handleKeyPress = async () => {
    await checkBreakTimeAndRedirect();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className="editor-container">
      <aside className="file-explorer">
        <Treeview.Root
          value={selected}
          onChange={(id: string) => openFile(id)}
          label="File Explorer"
          className="file-tree"
          fetchChildren={fetchChildren}
        >
          {treeData.map((node) => (
            <Treeview.Node node={node} key={node.id} />
          ))}
        </Treeview.Root>
      </aside>
      <main className="editor-main">
        <div className="toolbar">
          <input
            type="text"
            placeholder="File path"
            value={filePath}
            onChange={(e) => setFilePath(e.target.value)}
            className="file-path-input new-file-input"
            id="newFileName"
            onKeyDown={(e) =>
              e.key === "Enter" &&
              createNewFile(
                (document.getElementById("newFileName") as HTMLInputElement)
                  .value
              )
            }
          />
          <button
            onClick={() => {
              const newFileName = (
                document.getElementById("newFileName") as HTMLInputElement
              ).value;
              if (newFileName !== '' && newFileName !== null)
                createNewFile(newFileName);
            }}
            className="button new-file"
          >
            New File
          </button>
          <button onClick={() => openFile(filePath)} className="button open">
            Open
          </button>
          <button
            onClick={() => {
              const newFileName = (
                document.getElementById("newFileName") as HTMLInputElement
              ).value;
              if (newFileName !== '' && newFileName !== null)
                saveFile(newFileName);
            }}
            className="button save"
          >
            Save
          </button>
          <button
            onClick={deleteFile}
            className="button delete button-lilspacing"
          >
            Delete
          </button>
          <button
            onClick={() => {
              const newFileName = (
                document.getElementById("newFileName") as HTMLInputElement
              ).value;
              if (newFileName !== '' && newFileName !== null)
                executeFile(newFileName);
            }}
            className="button run button-spacing"
          >
            Run
            <div className="triangle-container">
              <span className="triangle"></span>
            </div>
          </button>
          <button onClick={toggleCipher} className="button cipher-decipher">
            <FontAwesomeIcon icon={isCiphered ? faEyeSlash : faEye}/>
          </button>
          <button onClick={openParamPopup} className="button parameters">
            <FontAwesomeIcon icon={faCog} />
          </button>
            <PopupParam onClosePopup={closeParamPopup} isOpen={isParamOpen} />
          <button onClick={logout} className="button logout">
            <FontAwesomeIcon icon={faPowerOff} />
          </button>
        </div>
        <div className="settings-bar">
          <div>
            <label htmlFor="fontSelector">Select Font:</label>
            <select
              id="fontSelector"
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="font-selector"
            >
              {[
                "Monospace",
                "Arial",
                "Courier New",
                "Georgia",
                "Tahoma",
                "Verdana",
                "JetBrains Mono",
                "Pixelify Sans",
                "Monofett",
                "Dancing Script",
                "Redacted Script",
                "Honk",
                "Pirata One",
                "Rye",
                "Rubik Glitch Pop",
                "Noto Sans Egyptian Hieroglyphs",
                "Amatic SC"
              ].map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="code-editor">
          <CodeMirrorEditor
            initialValue={content}
            language={language}
            onChange={handleChange}
            fontFamily={fontFamily}
          />
        </div>
        <pre className="output">{output}</pre>
        {showNotification5 && (
          <Notification
            message="Break starts in 5 minutes!"
            onClose={() => setShowNotification5(false)}
          />
        )}
        {showNotification2 && (
          <Notification
            message="Break starts in 2 minutes!"
            onClose={() => setShowNotification2(false)}
          />
        )}
        {showNotification1 && (
          <Notification
            message="Break starts in 1 minute!"
            onClose={() => setShowNotification1(false)}
          />
        )}
      </main>
      {showPasswordModal && (
        <PasswordModal
          onSubmit={async (password) => {
            if (await validatePassword(password)) {
              decipherContent();
              setIsCiphered(false);
              setShowPasswordModal(false);
            } else {
              alert("Incorrect password");
            }
          }}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </div>
  );
};

export default Editor;
