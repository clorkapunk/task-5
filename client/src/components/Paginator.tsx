import {Pagination} from "react-bootstrap";


function getPageRange(maxPage: number, currentPage: number): number[] {
    let start = 1
    let length = 5

    if(currentPage + 2 < maxPage && currentPage - 2 > 1){
        // length = 5
        if(currentPage - 2 > 1) {
            start = currentPage - 3
        }
    }
    else if(currentPage - 2 <= 1){
        start = 1
    }
    else{
        if(maxPage > 7) start = maxPage - 6
        else start = 1
    }

    if(maxPage <= 7){
        length = maxPage - 2
    }

    return  Array.from({ length: length }, (_, i) => i + 1 +  start);
}

function Paginator({currentPage, maxPages, onLoad}: {currentPage: number, maxPages: number, onLoad: (page: number) => void}) {


    return (
        <div className={'d-flex align-items-center justify-content-center'}>
            <Pagination className={'mt-3'}>
                <Pagination.Prev
                    onClick={() => {
                        if (currentPage - 1 <= 1) onLoad(1)
                        else onLoad(currentPage - 1)
                    }}

                />
                <Pagination.Item
                    active={1 === currentPage}
                    onClick={() => {
                        onLoad(1)
                    }}
                >{1}</Pagination.Item>

                {
                    (maxPages > 7 && currentPage - 1 > 3) &&
                    <Pagination.Ellipsis/>
                }

                {
                    getPageRange(maxPages, currentPage)
                        .map(i =>
                            <Pagination.Item
                                key={i}
                                active={i === currentPage}
                                onClick={() => {
                                    onLoad(i)
                                }}
                            >{i}</Pagination.Item>
                        )
                }

                {
                    (maxPages > 7 && maxPages - currentPage > 3) &&
                    <Pagination.Ellipsis/>
                }
                {
                    maxPages > 1 &&
                    <Pagination.Item
                        active={maxPages === currentPage}
                        onClick={() => {
                            onLoad(maxPages)
                        }}
                    >{maxPages}</Pagination.Item>
                }
                <Pagination.Next
                    onClick={() => {
                        // if (currentPage + 1 >= maxPages) onLoad(maxPages + 1)
                        // else
                        onLoad(currentPage + 1)
                    }}
                />
            </Pagination>
        </div>
    );
}

export default Paginator;
