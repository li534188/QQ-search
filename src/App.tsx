import { useCallback, useEffect, useState } from "react";
import Styles from "./app.module.scss";
import Loading from "./components/Loading";
import { getQQDate, type QQResType } from "./serve/QQAPI";

enum InputStatus {
  Success = "Success",
  Faild = "Faild",
}

function App() {
  const [status, setStatus] = useState<InputStatus | null>(null);
  const { loading, setQQ, apiData, errorMessage } = useQQHooks();

  const setQQValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setQQ(value);
  };

  useEffect(() => {
    if (apiData && apiData.code === 1) {
      setStatus(InputStatus.Success);
    } else if (apiData && apiData.code !== 1) {
      setStatus(InputStatus.Faild);
    } else {
      setStatus(null);
    }
  }, [apiData]);

  return (
    <div className="App">
      <section className={Styles.search_QQ_wrapper}>
        <header className={Styles.app_header}>
          <h1>QQ号查询</h1>
        </header>
        <label
          className={`${Styles.input_wrapper} ${
            status &&
            (status === InputStatus.Success ? Styles.check : Styles.error)
          }`}
        >
          QQ
          <input
            onChange={(e) => {
              setQQValue(e);
            }}
          />
        </label>
        {status === InputStatus.Faild && (
          <div data-testid="error-element" className={Styles.error_message}>
            {errorMessage}
          </div>
        )}
        <div className={Styles.info_wrapper}>
          {loading ? (
            <Loading size={20}></Loading>
          ) : apiData ? (
            <>
              <div className={Styles.head_portrait}>
                <img
                  src={apiData.qlogo}
                  className={Styles.logo_img}
                  alt="无法找到logo"
                />
              </div>
              <ul className={Styles.user_info}>
                <li data-testid="qq-element">{apiData.qq}</li>
                <li className={Styles.user_name} title={apiData.name}>
                  {apiData.name}
                </li>
              </ul>
            </>
          ) : (
            <div className={Styles.empty_block}>空空如也</div>
          )}
        </div>
      </section>
    </div>
  );
}

function useQQHooks() {
  const [qq, setQQ] = useState("");
  const [loading, setLaoding] = useState<Boolean>(false);
  const [apiData, setApiData] = useState<QQResType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const getData = async (qq: string) => {
    if (!qq) {
      return;
    }
    setLaoding(true);
    const res = await getQQDate({ qq });
    setLaoding(false);
    const { status_code, data, message } = res;
    if (status_code !== 200 || !data) {
      setErrorMessage(message);
      setApiData(null);
    } else {
      const { code, msg } = data;
      if (code === 1) {
        setApiData(data);
      } else {
        setApiData(data);
        setErrorMessage(msg);
      }
    }
  };
  const debGetData = useCallback(debounce(getData, 1000), []);

  useEffect(() => {
    if (qq) {
      setLaoding(true);
    } else {
      setLaoding(false);
      setApiData(null);
    }
    debGetData(qq);
  }, [qq, debGetData]);

  return { setQQ, errorMessage, apiData, loading, qq };
}

function debounce<T extends (...args: any) => any>(fn: T, delay: number) {
  let index: NodeJS.Timeout | null = null;
  return (...args: any[]) => {
    if (index) {
      window.clearTimeout(index);
      index = null;
    }
    index = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

export default App;
