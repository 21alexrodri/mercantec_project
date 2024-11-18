import { useCallback, useState, useEffect, useContext} from "react";
import "./customers_proposals.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import FilteredJob from "../filtered_job/filtered_job";
import { useTranslation } from 'react-i18next';
import { UserContext } from "../../context/UserContext";

export const CustomersProposals = ({ closeUserTable }) => {

    const [tagsList,setTagsList] = useState([])
    const { t } = useTranslation();
    const [filteredList,setFilteredTags] = useState([])
    const [updateTagList,setUpdateTagList] = useState(false)
    const [loading,setLoading] = useState(true)
    const {userId, username, isAdmin, isLogged, setUsername, setIsAdmin, setIsLogged } = useContext(UserContext);  

    const handleContainerClick = (e) => {
        e.stopPropagation();
    };

    const handleCustomerAction = (id,action) => {

        if(!isAdmin){
            return
        }

        setLoading(true)

        fetch("/3D_printer/3d_project/query.php",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                arg: 'modifyCustomers',
                id: id,
                action: action
            })
        }).then(response => {
            if(!response.ok){
                throw new Error("ERROR modifying customers")
            }

            setUpdateTagList(!updateTagList);
            setLoading(false)
        })
        .catch(error => {
            console.error("Error modifying tags: ",error)
            setLoading(false)
        })
    }

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            closeUserTable();
        }
    }, [closeUserTable]);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false); 
        };
    }, [escFunction]);

    useEffect(() => {
        setLoading(true)

        fetch('/3D_printer/3d_project/query.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                arg: 'getCustomers'
            }),
            credentials: 'include',
        })
        .then(response => response.json())
        .then(data => {
            setTagsList(data);
            setFilteredTags(data);
            setLoading(false)
        })
        .catch(error => {
            console.error('Error getting unaccepted customers:', error);
            setLoading(false)
        });
    }, [,updateTagList]);

    const sortTagsList = () => {
        setFilteredTags([...tagsList].sort((a, b) => a.accepted - b.accepted));
    };

    useEffect(() => {
        sortTagsList();
    }, [tagsList]);

    return (
        <div onClick={closeUserTable} className="blur_content">
            <div onClick={handleContainerClick} id="suggested_customers_table">
                <div className="popup_close">
                    <button onClick={closeUserTable}>X</button>
                </div>
                <div className="popup_title">
                    <h2>{t("edit-customers")}</h2>
                </div>
                <div className="suggested_customers_table_body">
                    <input 
                        type="text" 
                        placeholder={t("search-customers")}
                        className="suggested_customers_table_searchbar"
                    />
                    <div className="customers_table_results_container">
                        {loading ? (
                            <p className="loading-txt">Loading...</p>
                        ):(
                            <table>
                                <thead>
                                    <tr>
                                        <th>{t("customer-name")}</th>
                                        <th>{t("actions")}</th>
                                    </tr>
                                </thead>
                                <tbody className="customers_table_body">
                                    {filteredList.map((customer,index) => (
                                        <tr
                                            key={index} 
                                            className={customer.accepted == 0 ? "to-accept" : "accepted"}
                                            title={customer.accepted == 0 ? "To accept" : "Accepted"}
                                        >
                                            <td>{customer.customer_name}</td>
                                            {customer.accepted == 0 ? (
                                                <td>
                                                    <button onClick={()=>{handleCustomerAction(customer.id,"decline")}} className="decline">{t("decline")}</button>
                                                    <button onClick={()=>{handleCustomerAction(customer.id,"accept")}} className="accept">{t("accept")}</button>
                                                </td>
                                            ) : (
                                                <td>
                                                    <button onClick={()=>{handleCustomerAction(customer.id,"disable")}} className="disable">{t("disable")}</button>
                                                    <button onClick={()=>{handleCustomerAction(customer.id,"delete")}} className="delete">{t("delete")}</button>
                                                </td>
                                            )
                                        }
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        
                    </div>
                </div>
            </div>
        </div>
    );
};
