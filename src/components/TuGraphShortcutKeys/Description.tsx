import { Col, Modal, Row } from 'antd';
import * as React from 'react';
import './index.less';

interface DesscriptionProps {
  isModalOpen: boolean;
  handleCancel: () => void;
  handleOk: () => void;
}

const Desscription: React.FunctionComponent<DesscriptionProps> = props => {
  const { isModalOpen, handleCancel, handleOk } = props;

  return (
    <Modal 
      title={'快捷键'} 
      open={isModalOpen} 
      onOk={handleOk} 
      onCancel={handleCancel} 
      width={634}
      okText='确定'
      cancelText='取消'>
      <Row className="row">
        <Col className="oddIcon">
          <div className="startLeft">查询</div>
          <div className="endRight">
            <p className="iconF">⌘</p>
            <p className="iconF">F</p>
          </div>
        </Col>
        <Col className="oddIcon">
          <div className="startLeft">画布缩小</div>
          <div className="endRight">
            <p className="iconF">⌘</p>
            <p className="iconF">—</p>
          </div>
        </Col>
      </Row>
      <Row className="row">
        <Col className="evenIcon">
          <div className="startLeft">筛选</div>
          <div className="endRight">
            <p className="iconF">⇧</p>
            <p className="iconF">⌘</p>
            <p className="iconF">F</p>
          </div>
        </Col>
        <Col className="evenIcon">
          <div className="startLeft">画布1:1</div>
          <div className="endRight">
            <p className="iconF">⌘</p>
            <p className="iconF">1</p>
          </div>
        </Col>
      </Row>
      <Row className="row">
        <Col className="oddIcon">
          <div className="startLeft">扩散</div>
          <div className="endRight">
            <p className="iconF">⌘</p>
            <p className="iconF">D</p>
          </div>
        </Col>
        <Col className="oddIcon">
          <div className="startLeft">最大化</div>
          <div className="endRight">
            <p className="iconF">⌘</p>
            <p className="iconF"> {'>'} </p>
          </div>
        </Col>
      </Row>
      <Row className="row">
        <Col className="evenIcon">
          <div className="startLeft">边合并</div>
          <div className="endRight">
            <p className="iconF">⇧</p>
            <p className="iconF">E</p>
          </div>
        </Col>
        <Col className="evenIcon">
          <div className="startLeft">退出最大化</div>
          <div className="endRight">
            <p className="esc">Esc</p>
          </div>
        </Col>
      </Row>
      <Row className="row">
        <Col className="oddIcon">
          <div className="startLeft">隐藏节点/边</div>
          <div className="endRight">
            <p className="iconF">⌘</p>
            <p className="iconF">H</p>
          </div>
        </Col>
        <Col className="oddIcon">
          <div className="startLeft">删除</div>
          <div className="endRight">
            <p className="iconF">⌦</p>
          </div>
        </Col>
      </Row>
      <Row className="row">
        <Col className="evenIcon">
          <div className="startLeft">套索</div>
          <div className="endRight">
            <p className="iconF">⇧</p>
            <p className="iconF">H</p>
          </div>
        </Col>
        <Col className="evenIcon">
          <div className="startLeft">保存</div>
          <div className="endRight">
            <p className="iconF">⌘</p>
            <p className="iconF">S</p>
          </div>
        </Col>
      </Row>
      <Row className="row">
        <Col className="oddIcon">
          <div className="startLeft">清空画布</div>
          <div className="endRight">
            <p className="iconF">⌃</p>
            <p className="iconF">⌦</p>
          </div>
        </Col>
        <Col className="oddIcon">
          <div className="startLeft">复制</div>
          <div className="endRight">
            <p className="iconF">⌘</p>
            <p className="iconF">C</p>
          </div>
        </Col>
      </Row>
      <Row className="row">
        <Col className="evenIcon">
          <div className="startLeft">撤销</div>
          <div className="endRight">
            <p className="iconF">⌘</p>
            <p className="iconF">Z</p>
          </div>
        </Col>
        <Col className="evenIcon">
          <div className="startLeft">剪切</div>
          <div className="endRight">
            <p className="iconF">⌘</p>
            <p className="iconF">X</p>
          </div>
        </Col>
      </Row>
      <Row className="row">
        <Col className="oddIcon">
          <div className="startLeft">重做</div>
          <div className="endRight">
            <p className="iconF">⌘</p>
            <p className="iconF">Y</p>
          </div>
        </Col>
        <Col className="oddIcon">
          <div className="startLeft">粘贴</div>
          <div className="endRight">
            <p className="iconF">⌘</p>
            <p className="iconF">V</p>
          </div>
        </Col>
      </Row>
      <Row className="row">
        <Col className="evenIcon">
          <div className="startLeft">画布放大</div>
          <div className="endRight">
            <p className="iconF">⌘</p>
            <p className="iconF">+</p>
          </div>
        </Col>
      </Row>
    </Modal>
  );
};

export default Desscription;
