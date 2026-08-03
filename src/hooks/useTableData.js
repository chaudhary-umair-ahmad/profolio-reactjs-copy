import React, { useEffect, useState } from 'react';
import TableComponents from '../components/table';
import { getOBJValueByKey } from '../utility/utility';

const useTableData = (data, dataMapping, restrictedColumns, extraRowProps) => {
  const [state, setState] = useState({ data: [], columns: [] });

  useEffect(() => {
    setTableData();
  }, [data, data?.length]);

  const setTableData = () => {
    if (data && data.length) {
      const tableData = [];
      const tableColumns = [[], []];
      data.forEach((item, i) => {
        const obj = { key: item.id || i };
        dataMapping.forEach((e) => {
          if (e.children) {
            e.children.forEach((it) => {
              if (it.component === 'String') {
                obj[it.key] = getOBJValueByKey(item, it.dataIndex);
              } else if (it.component === 'AvatarName') {
                const name = getOBJValueByKey(item, it.dataIndex);
                const image = getOBJValueByKey(item, 'profile_image');
                const Component = TableComponents[it.component];
                obj[it.key] = <Component name={name} image={image} {...it} />;
              } else if (it.component === 'Image') {
                const imageUrl = getOBJValueByKey(item, it.dataIndex);
                const Component = TableComponents[it.component];
                obj[it.key] = <Component imageUrl={imageUrl} subKey={it.key} {...it} />;
              } else {
                const Component = TableComponents[it.component];
                obj[it.key] = <Component {...getOBJValueByKey(item, it.dataIndex, item)} subKey={it.key} {...it} {...extraRowProps} />;
              }
            });
          } else if (e.component === 'String') {
            obj[e.key] = getOBJValueByKey(item, e.dataIndex);
          } else if (e.component === 'AvatarName') {
            const name = getOBJValueByKey(item, e.dataIndex);
            const image = getOBJValueByKey(item, 'profile_image');
            const Component = TableComponents[e.component];
            obj[e.key] = <Component name={name} image={image} {...it} />;
          } else if (e.component === 'Image') {
            const imageUrl = getOBJValueByKey(item, e.dataIndex);
            const Component = TableComponents[e.component];
            obj[e.key] = <Component imageUrl={imageUrl} subKey={e.key} {...e} />;
          } else if (e?.component) {
            const Component = TableComponents[e.component];
            obj[e.key] = <Component {...getOBJValueByKey(item, e.dataIndex, item)} subKey={e.key} {...e} {...extraRowProps} />;
          } else if (e?.render) {
            const Component = e.render;
            obj[e.key] = <Component {...getOBJValueByKey(item, e.dataIndex, item)} subKey={e.key} {...e} />;
          }
        });
        tableData.push(obj);
      });
      setState({
        columns: dataMapping.map((e) => ({ ...e, dataIndex: e.key })),
        data: tableData,
      });
    } else {
      setState((prevState) => ({ data: [], columns: [] }));
    }
  };

  const removingIndexes = (restrictedColumns, tableColumns) => {
    // Filtering Indexes
    const filteredIndexes = restrictedColumns?.map((item) => {
      return tableColumns[1] && tableColumns[1].findIndex((child) => item === child);
    });

    // Removing Indexes
    const prettyNames =
      tableColumns[0] &&
      tableColumns[0].filter((item, index) => {
        return filteredIndexes?.indexOf(index) !== -1;
      });

    const queryNames =
      tableColumns[1] &&
      tableColumns[1].filter((item, index) => {
        return filteredIndexes?.indexOf(index) === -1;
      });
    return [prettyNames, queryNames];
  };

  const filteringTableColumns = (columnFilter = [], data) => {
    const columns = Object.keys(data[0]).filter((e) => {
      if (e === 'ID' || columnFilter.indexOf(e) !== -1) {
        return false;
      }
      return true;
    });
    return columns;
  };

  const getTableColumns = (data, restrictedColumns = [], tableColumns = []) => {
    let columns = [];
    if (data && data.length > 0) {
      const [prettyNames, queryNames] = removingIndexes(restrictedColumns, tableColumns);
      const filteredColumns = filteringTableColumns(prettyNames, data);
      columns = filteredColumns.map((item, index) => {
        return {
          title: item,
          selector: (item) => item,
          key: queryNames[index],
          dataIndex: queryNames[index],
          allowOverflow: true,
          sortable: !!queryNames[index],
          style: { fontSize: 13 },
        };
      });
      return columns;
    }
  };

  return [state.data, state.columns];
};

export default useTableData;
