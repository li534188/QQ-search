import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import App from "./App";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { QQResType } from "./serve/QQAPI";

const server = setupServer(
  rest.get("https://api.uomg.com/api/qq.info", (req, res, ctx) => {
    return res(ctx.json({ greeting: "hello there" }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("whether the API returns 500 as expected", async () => {
  const method = jest.fn();
  server.use(
    rest.get("https://api.uomg.com/api/qq.info", (req, res, ctx) => {
      console.log("test", "我已经拦截到");
      method();
      return res(ctx.status(500));
    })
  );

  render(<App />);
  const inputElement = screen.getByLabelText(/QQ/i);
  fireEvent.change(inputElement, { target: { value: 123 } });
  fireEvent.change(inputElement, { target: { value: 456 } });
  fireEvent.change(inputElement, { target: { value: 789 } });
  // 断言api500时是否有错误样式
  await waitFor(
    () => {
      expect(inputElement).toHaveClass("input_error");
    },
    { timeout: 1500 }
  );
  // 断言api500时是否有错误信息显示
  await waitFor(() => {
    const erroElement = screen.getByTestId("error-element");
    expect(erroElement).toHaveTextContent("服务器问题");
  });
  // 多次调用api是否只被调用一次
  await waitFor(() => {
    expect(method).toBeCalledTimes(1);
  });
});

test("When the API returns data normally", async () => {
  const apiData: QQResType = {
    code: 1,
    qq: "2502251",
    qlogo: "test",
    msg: "qq正常返回数据",
    lvzuan: [],
    name: "qqName",
  };
  server.use(
    rest.get("https://api.uomg.com/api/qq.info", (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(apiData));
    })
  );

  render(<App />);
  const inputElement = screen.getByLabelText(/QQ/i);
  fireEvent.change(inputElement, { target: { value: 123 } });
  // 断言api正常返回
  await waitFor(
    () => {
      const qqElement = screen.getByTestId("qq-element");
      expect(qqElement).toHaveTextContent(apiData.qq);
    },
    { timeout: 1500 }
  );
  await waitFor(
    () => {
      const imgElemensrc = screen.getByAltText("无法找到logo").getAttribute('src');
      expect(imgElemensrc).toEqual(apiData.qlogo);
    }
  );
});

test("The API request was successful, but the data was not requested", async () => {
  const apiData: QQResType = {
    code: 10723,
    qq: "2502251",
    qlogo: "test",
    msg: "qq正常返回数据",
    lvzuan: [],
    name: "qqName",
  };
  server.use(
    rest.get("https://api.uomg.com/api/qq.info", (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(apiData));
    })
  );

  render(<App />);
  const inputElement = screen.getByLabelText(/QQ/i);
  fireEvent.change(inputElement, { target: { value: 123 } });
  // 断言api请求成功，但是qq号错误
  await waitFor(
    () => {
      expect(inputElement).toHaveClass("input_error");
    },
    { timeout: 1500 }
  );
});
