import { useCallback, useEffect, useState } from "react";
import Styles from "./app.module.scss";
import Loading from "./components/Loading";
import { getQQDate, type QQResType } from "./serve/QQAPI";

enum InputStatus {
  Success,
  Faild,
}

function App() {
  const [QQ, setQQ] = useState<string>("");
  const [status, setStatus] = useState<InputStatus|null>(null);
  const [loading, setLaoding] = useState<Boolean>(false);
  const [apiData, setApiData] = useState<QQResType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    setLaoding(true);
    debGetData(QQ);
  }, [QQ]);

  const setQQValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setStatus(null);
    setQQ(value);
  };

  const getData = async (qq: string) => {
    setLaoding(true);
    const res = await getQQDate({ qq });
    setLaoding(false);
    const { status_code, data, message } = res;
    if (status_code !== 200 || !data) {
      setStatus(InputStatus.Faild);
      setErrorMessage(message);
      setApiData(null);
    } else {
      const { code, msg } = data;
      if (code === 1) {
        setStatus(InputStatus.Success);
        setApiData(data);
      } else {
        setStatus(InputStatus.Faild);
        setApiData(null);
        setErrorMessage(msg);
      }
    }
  };
  const debGetData = useCallback(debounce(getData, 1000), []);

  return (
    <div className="App">
      <section className={Styles.search_QQ_wrapper}>
        <header className={Styles.app_header}>
          <h1>QQ号查询</h1>
        </header>
        <label
          className={`${Styles.input_wrapper} ${
            status === InputStatus.Success ? Styles.check : Styles.error
          }`}
        >
          QQ
          <input
            value={QQ}
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
          {loading && <Loading size={20}></Loading>}
          {apiData ? (
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
