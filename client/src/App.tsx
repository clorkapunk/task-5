import Header from "./components/Header";
import {Container, Table} from "react-bootstrap";
import {ChangeEventHandler, useEffect, useRef, useState} from "react";
const REACT_APP_API_URL = import.meta.env.VITE_API_URL;
import axios from "axios";
import {FormControlProps} from "react-bootstrap/FormControl";
import Paginator from "./components/Paginator.tsx";
import {useSearchParams} from "react-router-dom";

export type Options = {
    region: string;
    errors: number;
    seed: number;
}

type Data = {
    index: string;
    id: string;
    fullName: string;
    address: string;
    phoneNumber: string;
}

interface ColumnName {
    [key: string]: string[];
}

const seedMax = 999999999;
const errorMax = 1000;


const columnsName: ColumnName = {
    us: ['#', "ID", "Full Name", "Address", "Phone number"],
    pl: ['#', "ID", "Full Name", "Address", "Phone number"],
    ru: ['#', "ID", "Full Name", "Address", "Phone number"],
}




function App() {
    const [searchParams, setSearchParams] = useSearchParams();
    const checkPageQueryParameter = (): number => {
        if(!searchParams.get("page")) return 1
        if(isNaN(Number(searchParams.get("page")))) return 1
        return Number(searchParams.get("page"))
    }

    const [options, setOptions] = useState<Options>({
        region: 'us',
        errors: 0,
        seed: 1
    })

    const [page, setPage] = useState<number>(checkPageQueryParameter)
    const [maxPages, setMaxPages] = useState<number>(page)
    const [isInfinite, setIsInfinite] = useState<boolean>(false)
    const [data, setData] = useState<Data[]>([])
    const elementRef = useRef(null);
    const [isFetching, setIsFetching] = useState<boolean>(false)
    const [isExporting, setIsExporting] = useState<boolean>(false)
    const firstUpdate = useRef(true);


    const onIntersection: IntersectionObserverCallback = function (entries) {
        const firstEntry = entries[0]
        if (firstEntry.isIntersecting) {
            loadPage(page + 1, isInfinite)
        }
    }

    const onFormChange: FormControlProps['onChange'] = function (e) {
        const {name, value} = e.target
        let newValue = value

        if (name === 'errors') {
            newValue = Number(newValue) > errorMax ?
                errorMax.toString()
                :
                (Number(newValue) < 0) ? '0' : newValue
        }

        if (name === 'seed') {
            newValue = Number(newValue) > seedMax ?
                seedMax.toString()
                :
                (Number(newValue) < 0) ? '0' : newValue
        }

        setOptions(prevState => ({
            ...prevState,
            [name]: newValue
        }))
    }

    const onSelectChange: ChangeEventHandler<HTMLSelectElement> = function (e) {
        const {name, value} = e.target

        if (name === "scroll") {
            setIsInfinite(Number(value) === 1)
            if(Number(value) === 0){
                setPage(1)
                loadPage(1, false)
            }
            else {
                loadPreviousPages(maxPages)
            }
        }
        if (name === 'region') {
            setOptions(prevState => ({
                ...prevState,
                [name]: value
            }))
        }
    }

    const onSeedRandom = () => {
        setOptions(prevState => ({
            ...prevState,
            seed: Math.floor(Math.random() * (seedMax + 1))
        }))
    }

    const onExport = () => {
        if(!isExporting){
            const fileName = `data-reg:${options.region}-err:${options.errors}-seed:${options.seed}-pages:${maxPages}.csv`
            setIsExporting(true)
            axios({
                url: `${REACT_APP_API_URL}download-csv?r=${options.region}&s=${options.seed}&e=${options.errors}&max=${maxPages}`, // Замените на нужный URL
                method: 'GET',
                responseType: 'blob'
            })
                .then(response => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', fileName);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setIsExporting(false)
                })
                .catch(error => {
                    console.error('Ошибка при скачивании:', error);
                    setIsExporting(false)
                });
        }
    }

    function loadPreviousPages(maxPage: number){
        setIsFetching(true)
        if (!isFetching) {
            axios.get(`${REACT_APP_API_URL}all?r=${options.region}&s=${options.seed}&e=${options.errors}&max=${maxPage}`)
                .then(r => {
                    setData(r.data.data)
                    setPage(r.data.page)
                    if (page > maxPages) setMaxPages(r.data.page)
                    setIsFetching(false)
                })
                .catch(e => {
                    console.log(e)
                    setIsFetching(false)
                })
        }
    }

    function loadPage(page: number, isInfinite: boolean) {
        setIsFetching(true)
        if (!isFetching) {
            axios.get(`${REACT_APP_API_URL}data?r=${options.region}&s=${options.seed}&e=${options.errors}&page=${page}`)
                .then(r => {
                    if (isInfinite) {
                        setData(prevState => ([...prevState, ...r.data.data]))
                    } else {
                        setData(r.data.data)
                    }
                    setPage(r.data.page)
                    if (page >= maxPages) setMaxPages(r.data.page)
                    setIsFetching(false)
                })
                .catch(e => {
                    console.log(e)
                    setIsFetching(false)
                })
        }
    }

    useEffect(() => {
        const observer = new IntersectionObserver(onIntersection)
        if (observer && elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (observer) observer.disconnect();
        }
    }, [isInfinite, isFetching]);

    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            setSearchParams({page: page.toString()})
            setIsFetching(true)
            if (!isFetching) {
                axios.get(`${REACT_APP_API_URL}data?r=${options.region}&s=${options.seed}&e=${options.errors}&page=${page}`)
                    .then(r => {
                        setData(r.data.data)
                        setPage(r.data.page)
                        setMaxPages(r.data.page)
                        setIsFetching(false)
                    })
                    .catch(e => {
                        console.log(e)
                        setIsFetching(false)
                    })
            }
        }
        else {
            console.log(`after: ${options.seed}, ${options.errors}`)
            setSearchParams({page: "1"})
            setIsFetching(true)
            if (!isFetching) {

                axios.get(`${REACT_APP_API_URL}data?r=${options.region}&s=${options.seed}&e=${options.errors}&page=1`)
                    .then(r => {
                        console.log(`length of data to seed ${options.seed} and errors ${options.errors}: ${r.data.data.length}.  ${isInfinite}`)
                        setData(r.data.data)
                        setPage(1)
                        setMaxPages(1)
                        setIsFetching(false)
                    })
                    .catch(e => {
                        console.log(e)
                        setIsFetching(false)
                    })
            }
        }
    }, [options]);


    return (
        <>
            <Header
                onFormChange={onFormChange}
                onSelectChange={onSelectChange}
                options={options}
                isInfinite={isInfinite}
                onSeedRandom={onSeedRandom}
                onExport={onExport}
            />
            <Container>
                <Table responsive striped bordered hover>
                    <thead>
                    {
                        columnsName[options.region].map(i =>
                            <th key={i}>{i}</th>
                        )
                    }
                    </thead>
                    <tbody>
                    {
                        data.map((i, index) =>
                            <tr key={index}>
                                <td>{i.index}</td>
                                <td>{i.id}</td>
                                <td>{i.fullName}</td>
                                <td>{i.address}</td>
                                <td>{i.phoneNumber}</td>
                            </tr>
                        )
                    }
                    </tbody>
                </Table>
                {
                    !isInfinite &&
                    <Paginator currentPage={page} maxPages={maxPages} onLoad={(e) => loadPage(e, isInfinite)}/>
                }
                {
                    (isInfinite && !isFetching) &&
                    <div ref={elementRef}/>
                }
            </Container>
        </>
    )
}

export default App
