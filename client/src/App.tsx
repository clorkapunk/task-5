import Header from "./components/Header.tsx";
import {Container, Table} from "react-bootstrap";
import {ChangeEventHandler, useEffect, useRef, useState} from "react";

import axios from "axios";
import {FormControlProps} from "react-bootstrap/FormControl";

export type Options = {
    region: string;
    errors: number;
    seed: number;
}

type Data = {
    id: string;
    fullName: string;
    address: string;
    phoneNumber: string;
}

interface ColumnName {
    [key: string]: string[];
}


const columnsName: ColumnName = {
    us: ['#', "ID", "Full Name", "Address", "Phone number"],
    pl: ['#', "ID", "Full Name", "Address", "Phone number"],
    ru: ['#', "ID", "Full Name", "Address", "Phone number"],
}


function App() {
    const [options, setOptions] = useState<Options>({
        region: 'us',
        errors: 1,
        seed: 1
    })
    const [page, setPage] = useState(1);
    const [limit] = useState<number>(20)
    const [data, setData] = useState<Data[]>([])
    const elementRef = useRef(null);

    const onIntersection: IntersectionObserverCallback = function () {

        // const firstEntry = entries[0]
        // if(firstEntry.isIntersecting){
        //     setAmount(prevState => (prevState + 10))
        // }
    }


    const onFormChange: FormControlProps['onChange'] = function (e) {
        const {name, value} = e.target
        let newValue = value

        if (name === 'errors') {
            newValue = Number(newValue) > 1000 ?
                '1000'
                :
                (Number(newValue) < 0) ? '0' : newValue
        }

        if (name === 'seed') {
            newValue = Number(newValue) > 999999999 ?
                '999999999'
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

        setOptions(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    useEffect(() => {
        const observer = new IntersectionObserver(onIntersection)
        if (observer && elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (observer) observer.disconnect();
        }
    }, []);


    useEffect(() => {
        axios.get(`http://localhost:3000/data?r=${options.region}&s=${options.seed}&e=${options.errors}&page=1&limit=20`)
            .then(r => {
                setData(r.data.data)
                setPage(r.data.page)
            })
    }, [options]);

    useEffect(() => {
        axios.get(`http://localhost:3000/data?r=${options.region}&s=${options.seed}&e=${options.errors}&page=${page}&limit=${limit}`)
            .then(r => {
                setData(r.data.data)
                setPage(r.data.page)
            })
    }, [limit, page])


    return (
        <>
            <Header onFormChange={onFormChange} onSelectChange={onSelectChange} options={options}/>
            <Container>
                <Table striped bordered hover>
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
                            <tr key={i.id}>
                                <td>{index + 1}</td>
                                <td>{i.id}</td>
                                <td>{i.fullName}</td>
                                <td>{i.address}</td>
                                <td>{i.phoneNumber}</td>
                            </tr>
                        )
                    }
                    </tbody>
                </Table>
                <div ref={elementRef}/>
            </Container>
        </>
    )
}

export default App
