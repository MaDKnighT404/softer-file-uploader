import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../Button';
import { Loader } from '../Loader';
import styles from './FileUploader.module.scss';

const MAX_FILES = 100;

const FileUploader = () => {
  const [token, setToken] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<string[]>(['Файлы не выбраны']);
  const [isLoading, setIsLoading] = useState(false);
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

  const handleLogin = () => {
    const client_id = 'b0bf6db8b1dd4cdb8f543735c5e062bd';
    const redirect_uri = 'http://localhost:5173/';
    const url = `https://oauth.yandex.com/authorize?response_type=token&client_id=${client_id}&redirect_uri=${redirect_uri}`;

    window.location.href = url;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash);
    const accessToken = urlParams.get('#access_token');
    if (accessToken) {
      setToken(accessToken);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleFileUpload = async () => {
    if (files.length > 0) {
      setIsLoading(true);
      for (const file of files) {
        try {
          const response = await axios.get(
            `${backendURL}/upload?url=https://cloud-api.yandex.net/v1/disk/resources/upload?path=disk:/${encodeURIComponent(
              file.name
            )}&overwrite=true&token=${token}`
          );

          const uploadUrl = response.data.href;

          await axios.put(
            `${backendURL}/upload?url=${uploadUrl}&type=${file.type}&token=${token}`,
            file
          );

        } catch (error) {
          console.error(error);
        }
      }
      setIsLoading(false);
      setFiles([]);
      setFileNames(['Файлы не выбраны']);

    } else {
      alert(`Пожалуйста, выберите файлы для отправки`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      let fileArray = Array.from(selectedFiles);
      if (fileArray.length > MAX_FILES) {
        alert(`Извините, но Вы не можете загрузить больше ${MAX_FILES} файлов за один раз.`);
        e.target.value = '';
        fileArray = [];
        setFiles([]);
        setFileNames(['Файлы не выбраны']);
      } else {
        setFiles(fileArray);
        setFileNames(fileArray.map((file) => file.name));
      }
    }
  };

  return (
    <div className={styles.fileuploader}>
      {!token && (
        <Button title="Войти через Яндекс.Диск" onClick={handleLogin} className="button_login" />
      )}
      {token && (
        <>
          {!isLoading ? (
            <div className={styles.fileuploader__controls}>
              <div className={styles.input__wrapper}>
                <input
                  name="file"
                  type="file"
                  id="input__file"
                  className={styles.input__file}
                  multiple
                  onChange={handleFileChange}
                />
                <label htmlFor="input__file" className={styles.input__file_button}>
                  <span className="input__file-button-text">Выберите файл</span>
                </label>
              </div>
              <Button title="Загрузить файлы" onClick={handleFileUpload} className="button_login" />
            </div>
          ) : (
            <Loader />
          )}
        </>
      )}
      <div className={styles.fileuploader__filenames}>
        {token &&
          !isLoading &&
          //тут не изменяемый список формируется, так что можно вообще оставить один индекс внутри key.
          fileNames.map((file, index) => <span key={`${file} + ${index}`}>{file}</span>)}
      </div>
    </div>
  );
};

export default FileUploader;
