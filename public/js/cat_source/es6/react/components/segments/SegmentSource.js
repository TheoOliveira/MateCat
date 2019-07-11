/**
 * React Component .

 */
const React = require('react');
const SegmentStore = require('../../stores/SegmentStore');
const SegmentConstants = require('../../constants/SegmentConstants');
const SegmentActions = require('../../actions/SegmentActions');


class SegmentSource extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            source : this.props.segment.decoded_source

        };
        this.originalSource = this.createEscapedSegment(this.props.segment.segment);
        this.createEscapedSegment = this.createEscapedSegment.bind(this);
        this.decodeTextSource = this.decodeTextSource.bind(this);
        this.replaceSource = this.replaceSource.bind(this);
        this.beforeRenderActions = this.beforeRenderActions.bind(this);
        this.afterRenderActions = this.afterRenderActions.bind(this);
        this.toggleTagLock = this.toggleTagLock.bind(this);
    }

    replaceSource(sid, source) {
        if (this.props.segment.sid == sid) {
            this.setState({
                source: source
            });
        }
    }

    toggleTagLock(sid, source) {
        this.setState({
            source: this.props.segment.decoded_source
        });
    }

    decodeTextSource(segment, source) {
        return this.props.decodeTextFn(segment, source);
    }

    createEscapedSegment(text) {
        if (!$.parseHTML(text).length) {
            text = text.replace(/<span(.*?)>/gi, '').replace(/<\/span>/gi, '');
        }

        let escapedSegment = htmlEncode(text.replace(/\"/g, "&quot;"));
        /* this is to show line feed in source too, because server side we replace \n with placeholders */
        escapedSegment = escapedSegment.replace( config.lfPlaceholderRegex, "\n" );
        escapedSegment = escapedSegment.replace( config.crPlaceholderRegex, "\r" );
        escapedSegment = escapedSegment.replace( config.crlfPlaceholderRegex, "\r\n" );
        return escapedSegment;
    }

    beforeRenderActions() {
        var area = $("#segment-" + this.props.segment.sid + " .source");
        this.props.beforeRenderOrUpdate(area);

    }

    afterRenderActions() {
        let area = $("#segment-" + this.props.segment.sid + " .source");
        this.props.afterRenderOrUpdate(area);
        let self = this;
        if ( this.splitContainer ) {
            $(this.splitContainer).on('mousedown', '.splitArea .splitpoint', function(e) {
                e.preventDefault();
                e.stopPropagation();
                $(this).remove();
                self.updateSplitNumber();
            })
        }
    }

    updateSplitNumber() {
        if (this.props.segment.splitted) return;
        let numSplits = $(this.splitContainer).find('.splitpoint').length + 1;
        let splitnum = $(this.splitContainer).find('.splitNum');
        $(splitnum).find('.num').text(numSplits);
        this.splitNum = numSplits;
        if (numSplits > 1) {
            $(splitnum).find('.plural').text('s');
            $(this.splitContainer).find('.btn-ok').removeClass('disabled');
        } else {
            $(splitnum).find('.plural').text('');
            splitnum.hide();
            $(this.splitContainer).find('.btn-ok').addClass('disabled');
        }
        $(this.splitContainer).find('.splitArea').blur();
    }

    onCopyEvent(e) {
        UI.handleCopyEvent(e);
    }

    onDragEvent(e) {
        UI.handleDragEvent(e);
    }

    addSplitPoint(event) {
        if(window.getSelection().type === 'Range') return false;
        pasteHtmlAtCaret('<span class="splitpoint"><span class="splitpoint-delete"/></span>');

        this.updateSplitNumber();
    }

    splitSegment(split) {
        let text = $(this.splitContainer).find('.splitArea').html();
        text = text.replace(/<span class=\"splitpoint\"><span class=\"splitpoint-delete\"><\/span><\/span>/, '##$_SPLIT$##');
        text = text.replace(/<span class=\"currentSplittedSegment\">(.*?)<\/span>/gi, '$1');
        text = UI.prepareTextToSend(text);
        // let splitArray = text.split('##_SPLIT_##');
        SegmentActions.splitSegment(this.props.segment.original_sid, text, split);
    }

    componentDidMount() {
        SegmentStore.addListener(SegmentConstants.REPLACE_SOURCE, this.replaceSource);
        SegmentStore.addListener(SegmentConstants.DISABLE_TAG_LOCK, this.toggleTagLock);
        SegmentStore.addListener(SegmentConstants.ENABLE_TAG_LOCK, this.toggleTagLock);
        this.afterRenderActions();
    }

    componentWillUnmount() {
        SegmentStore.removeListener(SegmentConstants.REPLACE_SOURCE, this.replaceSource);
        SegmentStore.removeListener(SegmentConstants.DISABLE_TAG_LOCK, this.toggleTagLock);
        SegmentStore.removeListener(SegmentConstants.ENABLE_TAG_LOCK, this.toggleTagLock);
    }
    componentWillMount() {
        this.beforeRenderActions();
    }
    componentWillUpdate() {
        this.beforeRenderActions();
    }

    componentDidUpdate() {
        this.afterRenderActions()
    }

    allowHTML(string) {
        return { __html: string };
    }

    render() {
        let html = <div className={"source item"}
                        tabIndex={0}
                        id={"segment-" + this.props.segment.sid +"-source"}
                        data-original={this.originalSource}
                        dangerouslySetInnerHTML={ this.allowHTML(this.state.source) }
                        onCopy={this.onCopyEvent.bind(this)}
                        onDragStart={this.onDragEvent.bind(this)}
        />;
        if ( this.props.segment.openSplit ) {
            if ( this.props.segment.splitted ) {
                let segmentsSplit = this.props.segment.split_group;
                let sourceHtml = '';
                segmentsSplit.forEach((sid, index)=>{
                    let segment = SegmentStore.getSegmentByIdToJS(sid);
                    if ( sid === this.props.segment.sid) {
                        sourceHtml += '<span class="currentSplittedSegment">'+segment.decoded_source+'</span>';
                    } else {
                        sourceHtml+= segment.decoded_source;
                    }
                    if(index !== segmentsSplit.length - 1)
                        sourceHtml += '<span class="splitpoint"><span class="splitpoint-delete"></span></span>';
                });
                html =  <div className="splitContainer" ref={(splitContainer)=>this.splitContainer=splitContainer}>
                    <div className="splitArea" contentEditable = "false"
                         onClick={(e)=>this.addSplitPoint(e)}
                         dangerouslySetInnerHTML={this.allowHTML(sourceHtml)}/>
                    <div className="splitBar">
                        <div className="buttons">
                            <a className="cancel btn-cancel" onClick={()=>SegmentActions.closeSplitSegment()}>Cancel</a >
                            <a className = {"done btn-ok pull-right" } onClick={()=>this.splitSegment()}> Confirm </a>
                        </div>
                        <div className="splitNum pull-right"> Split in <span className="num">1 </span> segment<span className="plural"/>
                        </div>
                    </div>
                </div >;
            } else {
                html =  <div className="splitContainer" ref={(splitContainer)=>this.splitContainer=splitContainer}>
                    <div className="splitArea" contentEditable = "false"
                         onClick={(e)=>this.addSplitPoint(e)}
                         dangerouslySetInnerHTML={this.allowHTML(this.state.source)}/>
                    <div className="splitBar">
                        <div className="buttons">
                            <a className="cancel btn-cancel" onClick={()=>SegmentActions.closeSplitSegment()}>Cancel</a >
                            <a className = {"done btn-ok pull-right disabled" } onClick={()=>this.splitSegment()}> Confirm </a>
                        </div>
                        <div className="splitNum pull-right"> Split in <span className="num">1 </span> segment<span className="plural"/>
                        </div>
                    </div>
                </div >;
            }
        }
        return html;

    }
}

export default SegmentSource;
