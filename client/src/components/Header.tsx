import {Col, Container, Row, Form, Button, Spinner} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFileExport, faShuffle} from "@fortawesome/free-solid-svg-icons";
import {Options} from "../App.tsx";
import {ChangeEventHandler} from "react";
import {FormControlProps} from "react-bootstrap/FormControl";



function Header({onFormChange, onSelectChange, options, isInfinite, onSeedRandom, onExport, isExporting}:
                    {
                        onFormChange: FormControlProps['onChange'],
                        onSelectChange: ChangeEventHandler<HTMLSelectElement>
                        options: Options,
                        isInfinite: boolean,
                        onSeedRandom: () => void,
                        onExport: () => void,
                        isExporting: boolean
                    }) {

    return (
        <div className={'bg-light pt-2 pb-4 border-bottom bg-body'}>
            <Container>
                <Row className={'d-flex justify-content-between'} style={{rowGap: 15}}>
                    <Col sm={5} lg={2}>
                        <Form className={'d-flex flex-column gap-0 align-items-center'}>
                            <Form.Label style={{fontSize: 16, fontWeight: 'bold', color: '#212529'}}>
                                Region
                            </Form.Label>
                            <Form.Select
                                name={'region'}
                                className={'w-full border-dark'}
                                value={options.region}
                                onChange={onSelectChange}
                            >
                                <option>Open</option>
                                <option value="us">USA</option>
                                <option value="pl">Poland</option>
                                <option value="ru">Russia</option>
                            </Form.Select>
                        </Form>
                    </Col>
                    <Col sm={5} lg={2} >
                        <Form className={'d-flex flex-column gap-0 align-items-center'}>
                            <Form.Label style={{fontSize: 16, fontWeight: 'bold', color: '#212529'}}>
                                Errors
                            </Form.Label>
                            <div className={"d-flex align-items-center gap-2 w-100"}>
                                <Form.Range
                                    value={options.errors}
                                    max={10}
                                    min={0}
                                    name={'errors'}
                                    onChange={onFormChange}
                                />
                                <Form.Control
                                    onKeyDown={(e) => {
                                        e.preventDefault()
                                    }}
                                    className={'border-dark'}
                                    type='number'
                                    step="any"
                                    value={options.errors}
                                    name={'errors'}
                                    onChange={onFormChange}
                                />
                            </div>
                        </Form>
                    </Col>
                    <Col sm={5} lg={2}>
                    <Form className={'d-flex flex-column gap-0 align-items-center'}>
                            <Form.Label style={{fontSize: 16, fontWeight: 'bold', color: '#212529'}}>
                                Seed
                            </Form.Label>
                            <div className={"d-flex align-items-center gap-2 w-100"}>
                                <Form.Control
                                    onKeyDown={(e) => {
                                        e.preventDefault()
                                    }}
                                    className={'border-dark'}
                                    type='number'
                                    value={options.seed}
                                    name={'seed'}
                                    onChange={onFormChange}
                                />
                                <Button onClick={() => onSeedRandom()} variant={"outline-dark"}>
                                    <FontAwesomeIcon icon={faShuffle}/>
                                </Button>
                            </div>

                        </Form>
                    </Col>
                    <Col sm={5} lg={2} className={'d-flex flex-column gap-0 align-items-center'}>
                        <Form.Label style={{fontSize: 16, fontWeight: 'bold', color: '#212529'}}>
                            Scroll
                        </Form.Label>
                        <Form.Select
                            name={'scroll'}
                            value={isInfinite ? 1 : 0}
                            className={'w-full border-dark'}
                            onChange={onSelectChange}
                        >
                            <option value={0}>Paged</option>
                            <option value={1}>Infinite</option>
                        </Form.Select>
                    </Col>
                    <Col lg={2} className={'d-flex flex-column gap-0 align-items-center'}>
                        <Form.Label style={{fontSize: 16, fontWeight: 'bold', color: '#212529'}}>
                            Export CSV
                        </Form.Label>
                        <Button
                            onClick={() => onExport()}
                            variant={'outline-dark'}
                            className={'d-flex align-items-center justify-content-center h-100'}
                            disabled={isExporting}
                        >
                            {
                                isExporting ?
                                    <Spinner animation="border" size='sm' />
                                    :
                                    <div>
                                        Export <FontAwesomeIcon icon={faFileExport}/>
                                    </div>
                            }
                        </Button>
                    </Col>

                </Row>
            </Container>
        </div>
    );
}

export default Header;
