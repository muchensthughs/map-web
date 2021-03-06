import React from 'react';
import { Button, Popconfirm, Rate } from 'antd';


class SideBarComponent extends React.Component {
    state = {
        inTrip: false,
    }

    handleAddToTrip = (e) => {
        // animation to hide this card
        this.setState(prevState => ({inTrip: !prevState.inTrip}));
        // add it to state in mapPage, add to database, add to cache?
        setTimeout(() => {this.props.addPointsToPlan(this.props.componentData, -1)}, 300)

    };

    onClickItem = () => {
        this.props.setPlaceCardData(this.props.componentData);
    }


    confirmAddPlace = (e) => {
        //e.stopPropagation();
        this.props.disablePopConfirm();
        this.handleAddToTrip();
    }

    render() {
        const { componentData, handleHoverSearchResult, popConfirmDisabled } = this.props;
        const { inTrip } = this.state;
        return (
            <div onMouseEnter={handleHoverSearchResult(componentData)} onMouseLeave={handleHoverSearchResult()} onClick={this.onClickItem} className='sidebar-component' style={{ maxHeight: inTrip? "0":"1000px", transition: "0.3s", visibility: inTrip ? "hidden":"visible"}}>
                <img src={componentData.imgURL} alt=" " height="100" width="100" />
                <div className="sidebar-description-and-button">
                    <div className='sidebar-description'>
                    <h1>{componentData.name}</h1>
                    <p style={{marginBottom: "0"}}>{componentData.category}</p>
                    <div>Rating: <Rate disabled value={componentData.rating} /></div>
                    </div>
                    <Popconfirm placement="top" title={"Recommended 6 number of places have reached, are you sure about adding more?"} onConfirm={this.confirmAddPlace} okText="Yes" cancelText="No" disabled={popConfirmDisabled}>
                        <Button shape="round" size="small" type="primary" className="add-to-trip-button" onClick={e => {e.stopPropagation(); if (popConfirmDisabled) {this.handleAddToTrip()} }}>Add to trip</Button>
                    </Popconfirm>
                </div>


            </div>
        );
    }
}

export default SideBarComponent;