import styled from 'styled-components';

// For png images to resize them as icons.
// The use of section instead of div, is to 
// prevent unwanted styling from the nth-div of the SharePostBox.
const ImageWrapper = styled.section`
  width: ${(props) => props.size || '24px'};
  height: ${(props) => props.size || '24px'};

  display: flex;
  justify-content: center;
  align-items: center;

  img {
    max-width: 100%;
    max-height: 100%;
  }
`;

export default ImageWrapper;
