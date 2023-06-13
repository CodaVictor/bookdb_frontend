import {Accordion, Typography, AccordionSummary, AccordionDetails, Checkbox, FormControlLabel, Box} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useState} from "react";

interface Props {
    filterData: FilterData[]
    currentFilter: FilterData[];
    setFilter: (value: FilterData[]) => any
}

export interface FilterItem {
    name: string,
    valueId: any
    checked: boolean
}

export interface FilterData {
    groupName: string,
    data: FilterItem[]
}


export function FilterPanel({filterData, currentFilter, setFilter}: Props) {
    const [expanded, setExpanded] = useState<string[]>([]);
    const panelPrefix = "panel";

    const handleExpandedChanged = (panelId: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        if(isExpanded) {
            setExpanded([...expanded, panelId]);
        } else {
            setExpanded(expanded.filter((item) => item !== panelId));
        }
    };

    const handleCheckedChanged = (groupIndex: number, filterItem: FilterItem, checked: boolean) => {
        const newFilter = [...currentFilter];
        filterItem.checked = checked;
        if(checked) {
            newFilter[groupIndex].data.push(filterItem)
        } else {
            newFilter[groupIndex].data = newFilter[groupIndex].data.filter((item) => item.valueId !== filterItem.valueId);
        }
        console.log(filterItem);
        setFilter(newFilter);
    };

    return Array.isArray(filterData) && filterData.map((item, dataIndex) => {
        const panelId = panelPrefix + dataIndex;
        return (
            <Accordion key={panelId} expanded={expanded.includes(panelId)} onChange={handleExpandedChanged(panelId)}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header">
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                        {item.groupName}
                    </Typography>
                </AccordionSummary>
                <Box sx={{pb: 0.5}}>
                {item.data.map((filterItem, itemIndex) => {
                    return (
                        <AccordionDetails key={filterItem.valueId} sx={{pb: 0}}>
                            <FormControlLabel
                                label={filterItem.name}
                                control={
                                    <Checkbox key={filterItem.name}
                                              onChange={(event, checked) => {
                                        handleCheckedChanged(dataIndex, filterItem, checked);
                                        console.log(currentFilter);
                                    }}/>
                                }
                            />
                        </AccordionDetails>
                    )
                })}
                </Box>
            </Accordion>
        )
    });
}