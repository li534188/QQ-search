import axios from "axios";
interface ResType<T> {
  status_code: number;
  data: T;
  message: string;
}
export interface QQResType {
  code: number;
  qq: string;
  qlogo: string;
  msg: string;
  lvzuan: any[];
  name: string;
}

export const getQQDate = async (data: {
  qq: string;
}): Promise<ResType<QQResType | null>> => {
  try {
    const res = await axios.get("https://api.uomg.com/api/qq.info", {
      params: data,
    });
    const { status, data: resData } = res;
    if (status !== 200) {
      return {
        status_code: status,
        data: null,
        message: "服务器出现问题",
      };
    } else {
      return {
        status_code: status,
        data: resData,
        message: "",
      };
    }
  } catch (e) {
    return {
      status_code: 500,
      data: null,
      message: "服务器问题",
    };
  }
};
