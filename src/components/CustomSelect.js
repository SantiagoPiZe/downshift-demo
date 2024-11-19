import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Downshift from 'downshift';

const CustomSelect = () => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    axios
      .get('https://dog.ceo/api/breeds/list/all')
      .then((response) => {
        const breeds = response.data.message;

        const breedsArray = Object.keys(breeds).map((breed) => ({
          value: breed,
          label: breed.charAt(0).toUpperCase() + breed.slice(1),
          group: ['pug', 'poodle', 'affenpinscher'].includes(breed)
            ? 'Dogs I would name Walter'
            : 'Dogs I would not name Walter',
        }));

        setOptions(breedsArray);
      })
      .catch((error) => console.error('Error fetching breeds:', error));
  }, []);

  return (
    <Downshift
      itemToString={item => item?.label || ''}
    >
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        isOpen,
        highlightedIndex,
        getToggleButtonProps,
        inputValue,
      }) => {
        const filteredOptions = options.filter((option) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase())
        );

        let itemIndex = -1;
        const groupedOptions = filteredOptions.reduce((acc, item) => {
          const group = acc.find((g) => g.group === item.group);
          if (group) {
            group.items.push(item);
          } else {
            acc.push({ group: item.group, items: [item] });
          }
          return acc;
        }, []);

        return (
          <div className="w-full max-w-md mx-auto mt-8">
            <label
              {...getLabelProps()}
              className="block text-lg font-medium text-gray-700"
            >
              Choose:
            </label>
            <div className="relative">
              <input
                {...getInputProps({
                  placeholder: 'Select',
                  className:
                    'w-full border border-gray-300 rounded-md',
                })}
              />
              <button
                {...getToggleButtonProps()}
                className="absolute inset-y-0 right-0 px-2 flex items-center"
                aria-label="toggle menu"
              >
                {`>`}
              </button>
              {isOpen && (
                <ul
                  {...getMenuProps()}
                  className="absolute w-full border border-gray-300 max-h-60 overflow-auto bg-white"
                  style={{ top: '100%' }}
                >
                  {groupedOptions.length > 0 ? (
                    groupedOptions.map((group) => (
                      <React.Fragment key={group.group}>
                        <li className="bg-gray-50 px-4 py-2 text-gray-700 font-semibold">
                          {group.group}
                        </li>
                        {group.items.map((item) => {
                          itemIndex += 1;
                          return (
                            <li
                              key={item.value}
                              {...getItemProps({
                                key: item.value,
                                index: itemIndex,
                                item,
                              })}
                              className={`px-4 py-2 cursor-pointer ${
                                highlightedIndex === itemIndex ? 'bg-gray-100' : ''
                              }`}
                            >
                              {item.label}
                            </li>
                          );
                        })}
                      </React.Fragment>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-500">
                      No breeds found for "{inputValue}"
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
        );
      }}
    </Downshift>
  );
};

export default CustomSelect;
