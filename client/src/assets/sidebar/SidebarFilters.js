import React from 'react';
import SidebarFilterByBrands from './SidebarFilterByBrands' ;
import SidebarFilterByPrice from './SidebarFilterByPrice' ;

const SidebarFilters = () => (
		
	   <div className="sidebar-filter margin-bottom-25">
        <SidebarFilterByBrands/>
        <SidebarFilterByPrice/>
      </div>
)

export default SidebarFilters;
    