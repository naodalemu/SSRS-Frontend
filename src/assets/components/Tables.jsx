import { useState, useEffect } from "react";
import axios from "axios";
import classes from "./Tables.module.css";
import { Link } from "react-router-dom";
import Backdrop from "./Backdrop";

function Tables({ onCloseBackdrop }) {
    const [tables, setTables] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/tables");
                const sortedTables = Array.isArray(response.data)
                ? response.data.sort((a, b) => a.table_number - b.table_number)
                : [];
                setTables(sortedTables);
            } catch (error) {
                setError("Failed to load table data");
            }
        };

        fetchTables();
    }, []);

    if (error) {
        return <Backdrop onCloseBackdrop={onCloseBackdrop}><p className={classes.errorDisplayContainer}>{error}</p></Backdrop>;
    }

    const occupiedTables = tables.filter(table => table.table_status === "occupied").length;
    const freeTables = tables.filter(table => table.table_status === "free").length;

    return (
        <Backdrop onCloseBackdrop={onCloseBackdrop}>
            <div className={classes.tableDisplayContainer} onClick={(e) => e.stopPropagation()}>
                <h3 className={classes.tableHeader}>Check for Available Tables</h3>
                <div className={classes.legend}>
                    <div>
                        <div className={classes.tableItem} style={{ background: "#fff", color: "#333" }}>{freeTables}</div>
                        <p>{freeTables > 1 ? "Free Tables" : "Free Table"}</p>
                    </div>
                    <div>
                        <div className={classes.tableItem} style={{ background: "#333", color: "#fff" }}>{occupiedTables}</div>
                        <p>{occupiedTables > 1 ? "Occupied Tables" : "Occupied Table"}</p>
                    </div>
                </div>
                <div className={classes.tablesContainer}>
                    {tables.map((table) => (
                        <Link 
                            key={table.table_number}
                            to={table.table_status === "occupied" ? null : `/menu/${table.table_number}`}
                            className={classes.tableItem} 
                            style={{ 
                                background: table.table_status === "occupied" ? "#333" : "#fff", 
                                color: table.table_status === "occupied" ? "#fff" : "#333" 
                            }}
                            onClick={table.table_status === "occupied" ? null : onCloseBackdrop}
                        >
                            { table.table_number }
                        </Link>
                    ))}
                </div>
            </div>
        </Backdrop>
    );
}

export default Tables;
