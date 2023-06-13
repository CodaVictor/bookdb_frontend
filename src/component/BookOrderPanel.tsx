import {Box, ToggleButtonGroup, ToggleButton, Typography} from "@mui/material";

interface Props {
    currentOrder: BookOrder
    setNewOrder: (value: BookOrder) => any
}

export interface BookOrder {
    name: string,
    orderParameterName: string
    orderDirection: "DESC" | "ASC"
}

export const orderParameters: BookOrder[] = [
    { name: "Název vzestupně", orderParameterName: "title", orderDirection: "ASC" },
    { name: "Název sestupně", orderParameterName: "title", orderDirection: "DESC" },
    { name: "Publikováno vzestupně", orderParameterName: "publicationDate", orderDirection: "ASC" },
    { name: "Publikováno sestupně", orderParameterName: "publicationDate", orderDirection: "DESC" }
]

export function BookOrderPanel({currentOrder, setNewOrder} : Props) {
    function handleChange(event: React.MouseEvent<HTMLElement>, newOrderParameter: BookOrder) {
        if(newOrderParameter != null) {
            setNewOrder(newOrderParameter);
        }
    }

    return (
        <Box component="span" sx={{ display: "flex", justifyContent: "center", alignItems: "center", pt: 2}}>
            <Typography variant="body1" sx={{mr: 1}}>Seřadit:</Typography>
            <ToggleButtonGroup exclusive={true} value={currentOrder} onChange={handleChange}>
                { orderParameters.map((item) => {
                    return <ToggleButton key={item.name} value={item}>{item.name}</ToggleButton>
                })}
            </ToggleButtonGroup>
        </Box>
    )
}