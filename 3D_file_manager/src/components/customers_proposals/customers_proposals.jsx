import { useCallback, useState, useEffect, useContext } from "react";
import "./customers_proposals.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import FilteredJob from "../filtered_job/filtered_job";
import { useTranslation } from 'react-i18next';
import { UserContext } from "../../context/UserContext";

/**
 * Admin's table to manage customers.
 * @param {closeUserTable} it closes the table 
 * @returns The customers proposals table
 */
export const CustomersProposals = ({ closeUserTable }) => {

    const [customersList, setcustomersList] = useState([])
    const { t } = useTranslation();
    const [filteredList, setFilteredCustomers] = useState([])
    const [updateTagList, setUpdateCustomerList] = useState(false)
    const [loading, setLoading] = useState(true)
    const { userId, username, isAdmin, isLogged, setUsername, setIsAdmin, setIsLogged } = useContext(UserContext);

    const handleContainerClick = (e) => {
        e.stopPropagation();
    };

    /**
     * Handles the action of the admin on the customer
     * @param {id} the id of the customer 
     * @param {action} the action to be done 
     * @returns The action to be done
     */
    const handleCustomerAction = (id, action) => {

        if (!isAdmin) {
            return
        }

        setLoading(true)

        fetch("/3D_printer/3d_project/query.php", {
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
            if (!response.ok) {
                throw new Error("ERROR modifying customers")
            }

            setUpdateCustomerList(!updateTagList);
            setLoading(false)
        })
            .catch(error => {
                console.error("Error modifying tags: ", error)
                setLoading(false)
            })
    }

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            closeUserTable();
        }
    }, [closeUserTable]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setFilteredCustomers(customersList.filter(customer => customer.customer_name.toLowerCase().includes(value)))
    }

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);

    /**
     * Gets the customers from the database
     */
    useEffect(() => {
        setLoading(true)

        console.log(isAdmin)

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
                setcustomersList(data);
                setFilteredCustomers(data);
                setLoading(false)
            })
            .catch(error => {
                console.error('Error getting unaccepted customers:', error);
                setLoading(false)
            });
    }, [, updateTagList]);

    const sortcustomersList = () => {
        setFilteredCustomers([...customersList].sort((a, b) => a.accepted - b.accepted));
    };

    useEffect(() => {
        sortcustomersList();
    }, [customersList]);

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
                        onChange={handleSearch}
                        type="text"
                        placeholder={t("search-customers")}
                        className="suggested_customers_table_searchbar"
                    />
                    <div className="customers_table_results_container">
                        {loading ? (
                            <p className="loading-txt">Loading...</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>{t("customer-name")}</th>
                                        <th>{t("actions")}</th>
                                    </tr>
                                </thead>
                                <tbody className="customers_table_body">
                                    {filteredList.map((customer, index) => (
                                        <tr
                                            key={index}
                                            className={customer.accepted == 0 ? "to-accept" : "accepted"}
                                            title={customer.accepted == 0 ? "To accept" : "Accepted"}
                                        >
                                            <td>{customer.customer_name}</td>
                                            {customer.accepted == 0 ? (
                                                <td>
                                                    <button onClick={() => { handleCustomerAction(customer.id, "decline") }} className="decline">{t("decline")}</button>
                                                    <button onClick={() => { handleCustomerAction(customer.id, "accept") }} className="accept">{t("accept")}</button>
                                                </td>
                                            ) : (
                                                <td>
                                                    <button onClick={() => { handleCustomerAction(customer.id, "disable") }} className="disable">{t("disable")}</button>
                                                    <button onClick={() => { handleCustomerAction(customer.id, "delete") }} className="delete">{t("delete")}</button>
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
