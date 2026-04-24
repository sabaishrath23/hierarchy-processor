import React from 'react';

const TreeNode = ({ name, childrenObj }) => {
  const childrenNames = Object.keys(childrenObj).sort();
  
  return (
    <div style={{ marginLeft: '20px', borderLeft: '1px solid #e9e9e7', paddingLeft: '16px', position: 'relative' }}>
      <div style={{ position: 'absolute', left: 0, top: '14px', width: '16px', height: '1px', backgroundColor: '#e9e9e7' }}></div>
      <div style={{ 
        display: 'inline-block', 
        background: 'white', 
        border: '1px solid #e9e9e7', 
        padding: '4px 10px', 
        borderRadius: '4px', 
        marginBottom: '8px', 
        fontSize: '13px', 
        fontWeight: '500',
        fontFamily: 'monospace'
      }}>
        {name}
      </div>
      {childrenNames.length > 0 && (
        <div>
          {childrenNames.map(childName => (
            <TreeNode 
              key={childName} 
              name={childName} 
              childrenObj={childrenObj[childName]} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TreeView = ({ data }) => {
  const ObjectRoots = Object.keys(data).sort();
  
  return (
    <div style={{ padding: '8px 0' }}>
      {ObjectRoots.map(rootName => (
        <TreeNode key={rootName} name={rootName} childrenObj={data[rootName]} />
      ))}
    </div>
  );
};

export default TreeView;
