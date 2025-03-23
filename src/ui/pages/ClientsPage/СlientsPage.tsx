import { useEffect, useState } from "react"

import { sdk } from "@/sdk";
import { Flex } from "@gravity-ui/uikit";
import { ClientCard } from "@/ui/components/ClientCard/ClientCard";
import { DefaultPage } from "../DefaultPage/DefaultPage";


export const ClientsPage = () => {
    const [clients, setClients] = useState([]);

    console.log(clients);


    useEffect(() => {
        sdk.getClients().then((result) => {
            setClients(result.data);
        });
    }, [setClients]);

    return (
        <DefaultPage title={'Клиенты'}>
            <Flex direction={'column'} gap={4}>
                {
                    clients.map((client) => <ClientCard username={client.username} companiesCount={client.companies.length} id={client._id}></ClientCard>)
                }
            </Flex>
        </DefaultPage>
    )
}