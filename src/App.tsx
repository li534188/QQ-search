import { useCallback, useState } from "react";
import Styles from "./app.module.scss";
import Loading from "./components/Loading";
import { getQQDate, type QQResType } from "./serve/QQAPI";

enum InputStatus {
  Normal,
  Success,
  Faild,
}

function App() {
  const [value, setValue] = useState<string>("");
  const [status, setStatus] = useState<InputStatus>(InputStatus.Normal);
  const [loading, setLaoding] = useState<Boolean>(false);
  const [qqData, setQQData] = useState<QQResType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const getQQData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setStatus(InputStatus.Normal);
    setValue(value);
    setLaoding(true);
    debGetData(value);
  };

  const getData = async (qq: string) => {
    setLaoding(true);
    const res = await getQQDate({ qq });
    setLaoding(false);
    const { status_code, data,message } = res;
    if (status_code !== 200 || !data) {
      setStatus(InputStatus.Faild);
      setErrorMessage(message);
      setQQData(null);
    } else {
      const {code, msg} = data;
      if(code === 1){
        setStatus(InputStatus.Success);
        setQQData(data);
      }else{
        setStatus(InputStatus.Faild);
        setQQData(null);
        setErrorMessage(msg)
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
            status === InputStatus.Success ? Styles.check : ""
          } ${status === InputStatus.Faild ? Styles.error : ""}`}
        >
          QQ
          <input
            className={`${Styles.search_input} ${
              status === InputStatus.Faild ? Styles.input_error : ""
            }`}
            value={value}
            onChange={(e) => {
              getQQData(e);
            }}
          />
        </label>
        {status === InputStatus.Faild&&<div data-testid="error-element" className={Styles.error_message}>{errorMessage}</div>}
        <div className={Styles.info_wrapper}>
          {loading ? (
            <Loading size={20}></Loading>
          ) : qqData ? (
            <>
              <div className={Styles.head_portrait}>
                <img
                  src={qqData.qlogo}
                  className={Styles.logo_img}
                  alt="无法找到logo"
                />
              </div>
              <ul className={Styles.user_info}>
                <li data-testid="qq-element" >{qqData.qq}</li>
                <li className={Styles.user_name} title={qqData.name}>{qqData.name}</li>
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
