import {Col, Container, Row, Form, Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShuffle} from "@fortawesome/free-solid-svg-icons";
import {Options} from "../App.tsx";
import {ChangeEventHandler} from "react";
import {FormControlProps} from "react-bootstrap/FormControl";



function Header({onFormChange, onSelectChange, options, isInfinite, onSeedRandom, onExport}:
                    {
                        onFormChange: FormControlProps['onChange'],
                        onSelectChange: ChangeEventHandler<HTMLSelectElement>
                        options: Options,
                        isInfinite: boolean,
                        onSeedRandom: () => void,
                        onExport: () => void
                    }) {

    return (
        <div className={'bg-light py-3'}>
            <Container>
                <Row>
                    <Col>
                        <Form className={'d-flex align-items-center gap-3'}>
                            <Form.Label>
                                Region:
                            </Form.Label>
                            <Form.Select
                                name={'region'}
                                value={options.region}
                                onChange={onSelectChange}
                                style={{maxWidth: 150}}
                            >
                                <option>Open</option>
                                <option value="us">USA</option>
                                <option value="pl">Poland</option>
                                <option value="ru">Russia</option>
                            </Form.Select>
                        </Form>
                    </Col>
                    <Col>
                        <Form className={'d-flex align-items-center gap-3'}>
                            <Form.Label>
                                Errors:
                            </Form.Label>
                            <Form.Range
                                value={options.errors}
                                max={10}
                                min={0}
                                name={'errors'}
                                onChange={onFormChange}
                            />
                            <Form.Control
                                type='number'
                                step="any"
                                value={options.errors}
                                name={'errors'}
                                onChange={onFormChange}
                            />
                        </Form>
                    </Col>
                    <Col>
                        <Form className={'d-flex align-items-center gap-3'}>
                            <Form.Label>
                                Seed:
                            </Form.Label>
                            <Form.Control
                                type='number'
                                value={options.seed}
                                name={'seed'}
                                onChange={onFormChange}
                            />
                            <Button onClick={() => onSeedRandom()}>
                                <FontAwesomeIcon icon={faShuffle}/>
                            </Button>
                        </Form>
                    </Col>
                    <Col>
                        <Button onClick={() => onExport()}>
                            Export
                        </Button>
                    </Col>
                    <Col>
                        <Form.Select
                            name={'scroll'}
                            value={isInfinite ? 1 : 0}
                            className={'w-auto'}
                            onChange={onSelectChange}
                        >
                            <option value={0}>Pages</option>
                            <option value={1}>Infinite</option>
                        </Form.Select>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Header;
