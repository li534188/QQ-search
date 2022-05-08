import Styles from "./index.module.scss";
interface Iprop {
  size: number;
  popClass?: String;
}
export default function Loading(props: Iprop) {
  const { size, popClass } = props;
  return (
    <div
      style={{ fontSize: size + "px" }}
      className={`${Styles.loading} ${popClass}`}
    >
      {new Array(5).fill("").map((item, index) => (
        <span key={index} />
      ))}
    </div>
  );
}
