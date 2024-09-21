import {Col, Container, Row, Form, Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShuffle} from "@fortawesome/free-solid-svg-icons";
import {Options} from "../App.tsx";
import {ChangeEvent, ChangeEventHandler} from "react";
import {FormControlProps} from "react-bootstrap/FormControl";


function Header({onFormChange, onSelectChange, options}:
                    {
                        onFormChange: FormControlProps['onChange'],
                        onSelectChange: ChangeEventHandler<HTMLSelectElement>
                        options: Options
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
                            <Button>
                                <FontAwesomeIcon icon={faShuffle}/>
                            </Button>
                        </Form>
                    </Col>
                    <Col>
                        <Button>
                            Export
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Header;
