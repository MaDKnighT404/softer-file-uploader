import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../UI/Button';
import { Loader } from '../UI/Loader';
import { InputFile } from '../UI/InputFile';
import styles from './FileUploader.module.scss';

const MAX_FILES = 100;

const FileUploader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [allFilesIsLoading, setAllFilesIsLoading] = useState(false);

  const [token, setToken] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<string[]>(['Файлы не выбраны']);
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const handleLogin = () => {
    const client_id = import.meta.env.VITE_CLIENT_ID;
    const redirect_uri = import.meta.env.VITE_REDIRECT_URI;
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
      setAllFilesIsLoading((prev) => !prev);
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

  const handlerAllFilesIsLoadingToggle = () => {
    setAllFilesIsLoading((prev) => !prev);
  };

  if (allFilesIsLoading)
    return (
      <div className={styles.fileuploader}>
        <h2> Загрузка файлов завершена!</h2>
        <Button
          title="Загрузить ещё"
          onClick={handlerAllFilesIsLoadingToggle}
          className="button_login"
        />
      </div>
    );

  return (
    <div className={styles.fileuploader}>
      {!token && (
        <Button title="Войти через Яндекс.Диск" onClick={handleLogin} className="button_login" />
      )}
      {token && (
        <>
          {!isLoading ? (
            <div className={styles.fileuploader__controls}>
              <InputFile onChange={handleFileChange} />
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
          //в данном случае можно использовать index в качестве key, потому что мы никогда не изменяем порядок файлов. Но в реальном проекте я бы всё равно использовал nanoid (причем вызов nanoid было бы не тут в key, а в стейте...)
          fileNames.map((file, index) => <span key={index}>{file}</span>)}
      </div>
    </div>
  );
};

export default FileUploader;
