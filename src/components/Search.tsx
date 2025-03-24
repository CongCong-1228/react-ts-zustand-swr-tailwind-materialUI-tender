import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

interface SearchProps {
  onSearch: (query: string) => void; // 接收一个搜索函数作为 props
}

export const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value); // 更新输入框的值
  };

  const handleSearch = () => {
    onSearch(query); // 调用传入的搜索函数
  };

  return (
    <div className="flex h-full items-center justify-center border border-[#cbcbcb]">
      <input
        type="text"
        placeholder="输入关键词搜索"
        className="h-full w-full p-2 focus:outline-none"
        value={query}
        onChange={handleInputChange} // 处理输入变化
      />
      <button
        className="flex h-full items-center justify-center bg-[#74b1fc] p-4"
        onClick={handleSearch} // 处理搜索按钮点击
      >
        <FontAwesomeIcon
          size="lg"
          icon={faSearch}
          color="#fff"
          className="text-[#fff]"
        />
      </button>
    </div>
  );
};
