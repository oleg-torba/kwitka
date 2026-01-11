
import styles from "../../warranty/page.module.css"; 
import { FaCheckCircle, FaTimesCircle, FaUserClock } from "react-icons/fa";
const CertificateTable = ({ data, onRowClick  }) => {

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("uk-UA");
  };

  return (
    <div className={styles.tableContainer}> 
    
      <table className={styles.certificateTable}>
        <thead>
          <tr  onClick={() => onRowClick(item)}
>
            <th>#</th>
            <th>№</th>
            <th>Дата</th>
            <th>Бренд</th>
            <th>Запчастина</th>
            <th>Статус</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr  onClick={() => onRowClick(item)} key={item._id}>
              <td>
                <input type="checkbox" />
              </td>
              <td>{item.repairNumber}</td>
              <td>{formatDate(item.createdAt)}</td>
              <td>{item.brand}</td>
              <td>
                {item.part?.split("/").map((parts, index) => (
                  <div key={index}>{parts}</div>
                ))}
              </td>
              <td>
                {" "}
            <div
  style={{
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 10px",
    borderRadius: "6px",
    backgroundColor:
      item.rezolution === "ok"
        ? "rgba(76, 175, 80, 0.08)" 
        : item.rezolution === "rejected"
        ? "rgba(255, 152, 0, 0.10)"       
        : "rgba(33, 150, 243, 0.08)", 
    color:
      item.rezolution === "ok"
        ? "#2E7D32"
        : item.rezolution === "rejected"
        ? "#EF6C00"
        : "#1565C0",
    whiteSpace: "nowrap",
  }}
>
  {item.rezolution === "ok" && <FaCheckCircle size={16} />}
  {item.rezolution === "rejected" && <FaTimesCircle size={16} />}
  {!item.rezolution && <FaUserClock size={16} />}

  <span>
    {item.rezolution === "ok"
      ? "Погоджено"
      : item.rezolution === "rejected"
      ? "Відхилено"
      : "На погодженні"}
  </span>
</div>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CertificateTable;
